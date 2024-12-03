import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/crear-cita.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.citas.findMany({
      include: {
        paciente: true,
        servicio: true
      }
    });
  }

  async findPending() {
    return this.prisma.citas.findMany({
      where: {
        fechaHora: {
          gte: new Date(),
        },
      },
      include: { 
        paciente: true, 
        servicio: true 
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findCompleted() {
    return this.prisma.citas.findMany({
      where: {
        fechaHora: {
          lt: new Date(),
        },
      },
      include: { 
        paciente: true, 
        servicio: true 
      },
      orderBy: {
        fechaHora: 'desc',
      },
    });
  }

  async create(createCitaDto: CreateCitaDto) {
    // Verificar si el servicio existe
    const servicio = await this.prisma.servicios.findUnique({
      where: { id: createCitaDto.servicioId },
    });

    if (!servicio) {
      throw new NotFoundException('El servicio especificado no existe');
    }

    // Verificar si el paciente existe y asi se obtiene su nombre completo
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: createCitaDto.pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException('El paciente especificado no existe');
    }

    
    const nombreCompleto = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;

   
    return this.prisma.citas.create({
      data: {
        nombre: nombreCompleto,
        paciente: {
          connect: { id: createCitaDto.pacienteId }
        },
        servicio: {
          connect: { id: createCitaDto.servicioId }
        },
        telefono: createCitaDto.telefono,
        fechaHora: new Date(createCitaDto.fechaHora),
        comentarios: createCitaDto.comentarios || '',
      },
      include: {
        paciente: true,
        servicio: true
      }
    });
  }

  async update(id: number, updateCitaDto: Partial<CreateCitaDto>) {
    const existingCita = await this.findOne(id);

    
    let nombreCompleto = existingCita.nombre;
    if (updateCitaDto.pacienteId) {
      const paciente = await this.prisma.paciente.findUnique({
        where: { id: updateCitaDto.pacienteId },
      });
      if (!paciente) {
        throw new NotFoundException('El paciente especificado no existe');
      }
      nombreCompleto = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;
    }

    return this.prisma.citas.update({
      where: { id },
      data: {
        nombre: nombreCompleto,
        ...(updateCitaDto.pacienteId && {
          paciente: { connect: { id: updateCitaDto.pacienteId } }
        }),
        ...(updateCitaDto.servicioId && {
          servicio: { connect: { id: updateCitaDto.servicioId } }
        }),
        ...(updateCitaDto.telefono && { telefono: updateCitaDto.telefono }),
        ...(updateCitaDto.fechaHora && { fechaHora: new Date(updateCitaDto.fechaHora) }),
        ...(updateCitaDto.comentarios && { comentarios: updateCitaDto.comentarios }),
      },
      include: {
        paciente: true,
        servicio: true
      }
    });
  }

  async findOne(id: number) {
    const cita = await this.prisma.citas.findUnique({
      where: { id },
      include: {
        paciente: true,
        servicio: true
      }
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar si la cita existe
    return this.prisma.citas.delete({
      where: { id }
    });
  }

  async findCalendarAppointments(inicio: Date, fin: Date) {
    return this.prisma.citas.findMany({
      where: {
        fechaHora: {
          gte: inicio,
          lte: fin,
        },
      },
      include: { 
        paciente: true, 
        servicio: true 
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findByPaciente(pacienteId: number) {
    console.log('Service: Buscando citas para el paciente:', pacienteId);
    try {
      const citas = await this.prisma.citas.findMany({
        where: {
          pacienteId: pacienteId
        },
        include: {
          servicio: true,
          paciente: true
        },
        orderBy: {
          fechaHora: 'desc'
        }
      });

      console.log('Citas encontradas:', citas);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas:', error);
      throw error;
    }
  }
}

