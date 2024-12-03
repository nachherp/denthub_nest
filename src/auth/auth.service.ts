import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

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
      console.log('Contrasena invalida');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('Login successful');

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
}

