import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.servicios.findMany();
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  }
}

