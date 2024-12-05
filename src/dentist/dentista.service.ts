import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class DentistaService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async obtenerPerfil(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      console.log('Token recibido:', token);
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'tu_clave_secreta_temporal'
      }) as JwtPayload;
      console.log('Token decodificado:', decodedToken);
      
      if (decodedToken.role !== 'dentist') {
        console.log('Role incorrecto:', decodedToken.role);
        throw new UnauthorizedException('El usuario no es un dentista');
      }

      console.log('Buscando dentista con email:', decodedToken.email);
      
      const dentista = await this.prisma.dentista.findUnique({
        where: {
          correoElectronico: decodedToken.email
        }
      });
      
      console.log('Dentista encontrado:', dentista);

      if (!dentista) {
        throw new NotFoundException('Perfil de dentista no encontrado');
      }

      return dentista;

    } catch (error) {
      console.error('Error completo en obtenerPerfil:', error);
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido');
    }
  }

  async actualizarPerfil(id: number, datosActualizados: any, token: string) {
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || '12345'
      }) as JwtPayload;

      if (decodedToken.role !== 'dentist') {
        throw new UnauthorizedException('El usuario no es un dentista');
      }

      const dentista = await this.prisma.dentista.update({
        where: { id },
        data: datosActualizados,
      });

      if (!dentista) {
        throw new NotFoundException('Perfil de dentista no encontrado');
      }

      return dentista;
    } catch (error) {
      console.error('Error completo en actualizarPerfil:', error);
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido o error al actualizar');
    }
  }
}

