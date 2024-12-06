import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(userData: any) {
    try {
      const existingUser = await this.prisma.paciente.findUnique({
        where: { correoElectronico: userData.correoElectronico },
      });

      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      const newUser = await this.prisma.paciente.create({
        data: {
          nombre: userData.nombre,
          apellidoPaterno: userData.apellidoPaterno,
          apellidoMaterno: userData.apellidoMaterno,
          fechaNacimiento: new Date(userData.fechaNacimiento),
          correoElectronico: userData.correoElectronico,
          contrasena: userData.contrasena, 
          numeroTelefono: userData.numeroTelefono,
          nacionalidad: userData.nacionalidad,
          sexo: userData.sexo,
          role: userData.role,
        },
      });

      const token = this.jwtService.sign({ 
        sub: newUser.id, 
        email: newUser.correoElectronico, 
        role: newUser.role 
      });

      return {
        success: true,
        user: {
          id: newUser.id,
          correoElectronico: newUser.correoElectronico,
          role: newUser.role,
        },
        access_token: token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error durante el registro:', error);
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  async login(correoElectronico: string, contrasena: string, role: string) {
    console.log(`Intentando login con email: ${correoElectronico}, role: ${role}`);
    
    let user;
    if (role === 'patient') {
      user = await this.prisma.paciente.findUnique({ where: { correoElectronico } });
    } else if (role === 'dentist') {
      user = await this.prisma.dentista.findUnique({ where: { correoElectronico } });
    } else {
      throw new UnauthorizedException('Rol no válido');
    }

    if (!user) {
      console.log('Usuario no encontrado');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('User found:', user);

    if (user.contrasena !== contrasena) {
      console.log('Contraseña inválida');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('Login exitoso');

    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.correoElectronico, 
      role: user.role 
    });

    return {
      success: true,
      user: { id: user.id, correoElectronico: user.correoElectronico, role: user.role },
      access_token: token,
    };
  }

  async googleLogin(token: string) {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { email, name, sub: googleId, picture } = googleResponse.data;

      let user = await this.prisma.paciente.findUnique({
        where: { correoElectronico: email }
      });

      if (!user) {
        user = await this.prisma.paciente.create({
          data: {
            correoElectronico: email,
            nombre: name,
            googleId,
            fotoPerfil: picture,
            role: 'patient',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaNacimiento: new Date(),
            contrasena: '', 
            nacionalidad: '',
            sexo: '',
          }
        });
      }

      const jwtToken = this.jwtService.sign({ 
        sub: user.id, 
        email: user.correoElectronico, 
        role: user.role 
      });

      return {
        success: true,
        user: { id: user.id, correoElectronico: user.correoElectronico, role: user.role },
        access_token: jwtToken,
      };
    } catch (error) {
      console.error('Error en el inicio de sesión de Google:', error);
      throw new UnauthorizedException('Error en la autenticación con Google');
    }
  }

  async facebookLogin(token: string) {
    try {
      const facebookResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      const { email, name, id: facebookId, picture } = facebookResponse.data;

      // Primero, intentamos encontrar al usuario por facebookId
      let user = await this.prisma.paciente.findUnique({
        where: { facebookId }
      });

      // Si no se encuentra por facebookId y hay un correo que este en nuestra bd, buscamos por el correo
      if (!user && email) {
        user = await this.prisma.paciente.findUnique({
          where: { correoElectronico: email }
        });
      }

      // Si aún no se encuentra el paciente, creamos uno nuevo
      if (!user) {
        user = await this.prisma.paciente.create({
          data: {
            correoElectronico: email || `fb_${facebookId}@placeholder.com`, // Correo de respaldo si no se proporciona
            nombre: name,
            facebookId,
            fotoPerfil: picture?.data?.url,
            role: 'patient',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaNacimiento: new Date(),
            contrasena: '', 
            nacionalidad: '',
            sexo: '',
          }
        });
      } else if (!user.facebookId) {
        // Si el usuario existe pero no tiene facebookId, lo actualizamos
        user = await this.prisma.paciente.update({
          where: { id: user.id },
          data: { facebookId }
        });
      }

      const jwtToken = this.jwtService.sign({ 
        sub: user.id, 
        email: user.correoElectronico, 
        role: user.role 
      });

      return {
        success: true,
        user: { id: user.id, correoElectronico: user.correoElectronico, role: user.role },
        access_token: jwtToken,
      };
    } catch (error) {
      console.error('Error en el inicio de sesión de Facebook:', error);
      throw new UnauthorizedException('Error en la autenticación con Facebook');
    }
  }
}