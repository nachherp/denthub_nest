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
    const servicio = await this.prisma.servicios.findUnique({
      where: { id: createCitaDto.servicioId },
    });

    if (!servicio) {
      throw new NotFoundException('El servicio especificado no existe');
    }

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
    await this.findOne(id);
    return this.prisma.citas.delete({
      where: { id }
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

  async getDashboardData() {
    const [totalCitas, citasPendientes, citasPorServicio] = await Promise.all([
      this.prisma.citas.count(),
      this.prisma.citas.count({
        where: {
          fechaHora: {
            gte: new Date(),
          },
        },
      }),
      this.prisma.citas.groupBy({
        by: ['servicioId'],
        _count: {
          id: true
        },
      })
    ]);

    const citasCompletadas = totalCitas - citasPendientes;

    const servicios = await this.prisma.servicios.findMany();
    const serviciosMap = new Map(servicios.map(s => [s.id, s.nombre]));

    const appointmentsByService = await this.prisma.citas.groupBy({
      by: ['servicioId'],
      _count: {
        id: true
      },
      where: {
        fechaHora: {
          gte: new Date(),
        },
      },
    });

    const citasPorServicioMap = new Map();
    appointmentsByService.forEach(item => {
      const servicioNombre = serviciosMap.get(item.servicioId) || 'Desconocido';
      citasPorServicioMap.set(servicioNombre, item._count.id);
    });

    const totalAppointments = Array.from(citasPorServicioMap.values()).reduce((sum, count) => sum + count, 0);

    const serviceDistribution = Array.from(citasPorServicioMap.entries()).map(([servicio, count]) => ({
      servicio,
      porcentaje: (count / totalAppointments) * 100
    }));

    return {
      metrics: {
        totalCitas,
        citasCompletadas,
        citasPendientes
      },
      appointmentsByService: Array.from(citasPorServicioMap.entries()).map(([servicio, citasProgramadas]) => ({
        servicio,
        citasProgramadas,
        citasCompletadas: citasPorServicio.find(c => serviciosMap.get(c.servicioId) === servicio)?._count.id || 0
      })),
      serviceDistribution
    };
  }
}

