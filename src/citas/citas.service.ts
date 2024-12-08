import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/crear-cita.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.citas.findMany({
      include: {
        paciente: true,
        servicio: true,
      },
    });
  }

  async findPending() {
    return this.prisma.citas.findMany({
      where: {
        fechaHora: {
          gte: new Date(),
        },
        completada: false,
      },
      include: { paciente: true, servicio: true },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findCompleted() {
    return this.prisma.citas.findMany({
      where: {
        completada: true,
      },
      include: { paciente: true, servicio: true },
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
      throw new NotFoundException('El servicio no existe');
    }

    const paciente = await this.prisma.paciente.findUnique({
      where: { id: createCitaDto.pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException('El paciente especificado no existe');
    }

    const nombreCompleto = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;

    // Verificar disponibilidad
    const fechaHoraUTC = new Date(createCitaDto.fechaHora);
    const disponibilidad = await this.obtenerDisponibilidad(
      fechaHoraUTC.toISOString().split('T')[0],
    );

    const horaSeleccionada = fechaHoraUTC.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    if (!disponibilidad.includes(horaSeleccionada)) {
      throw new BadRequestException('La hora seleccionada no está disponible');
    }

    return this.prisma.citas.create({
      data: {
        nombre: nombreCompleto,
        paciente: {
          connect: { id: createCitaDto.pacienteId },
        },
        servicio: {
          connect: { id: createCitaDto.servicioId },
        },
        telefono: createCitaDto.telefono,
        fechaHora: fechaHoraUTC,
        comentarios: createCitaDto.comentarios || '',
        completada: false,
      },
      include: {
        paciente: true,
        servicio: true,
      },
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
          paciente: { connect: { id: updateCitaDto.pacienteId } },
        }),
        ...(updateCitaDto.servicioId && {
          servicio: { connect: { id: updateCitaDto.servicioId } },
        }),
        ...(updateCitaDto.telefono && { telefono: updateCitaDto.telefono }),
        ...(updateCitaDto.fechaHora && {
          fechaHora: new Date(updateCitaDto.fechaHora),
        }),
        ...(updateCitaDto.comentarios && { comentarios: updateCitaDto.comentarios }),
      },
      include: {
        paciente: true,
        servicio: true,
      },
    });
  }

  async findOne(id: number) {
    const cita = await this.prisma.citas.findUnique({
      where: { id },
      include: {
        paciente: true,
        servicio: true,
      },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  async remove(id: number) {
    const cita = await this.findOne(id);
    if (cita.completada) {
      throw new BadRequestException('No se puede eliminar una cita completada');
    }
    return this.prisma.citas.delete({
      where: { id },
    });
  }

  async findByPaciente(pacienteId: number) {
    console.log('Service: Buscando citas para el paciente:', pacienteId);
    try {
      const citas = await this.prisma.citas.findMany({
        where: {
          pacienteId: pacienteId,
        },
        include: {
          servicio: true,
          paciente: true,
        },
        orderBy: {
          fechaHora: 'desc',
        },
      });

      console.log('Citas encontradas:', citas);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas:', error);
      throw error;
    }
  }

  async getDashboardData() {
    const [totalCitas, citasPendientes, citasCompletadas] = await Promise.all([
      this.prisma.citas.count(),
      this.prisma.citas.count({
        where: {
          fechaHora: {
            gte: new Date(),
          },
          completada: false,
        },
      }),
      this.prisma.citas.count({
        where: {
          completada: true,
        },
      }),
    ]);

    const servicios = await this.prisma.servicios.findMany();

    const citasPorServicio = await this.prisma.citas.groupBy({
      by: ['servicioId'],
      _count: true,
    });

    const serviciosMap = new Map(servicios.map((s) => [s.id, s.nombre]));

    const serviceDistribution = citasPorServicio.map((item) => ({
      servicio: serviciosMap.get(item.servicioId) || 'Desconocido',
      count: item._count,
    }));

    return {
      metrics: {
        totalCitas,
        citasCompletadas,
        citasPendientes,
      },
      serviceDistribution,
    };
  }

  async obtenerDisponibilidad(fecha: string): Promise<string[]> {
    const todosLosHorarios = this.generarHorarios();

    const fechaInicio = new Date(`${fecha}T00:00:00Z`);
    const fechaFin = new Date(`${fecha}T23:59:59Z`);

    const citasExistentes = await this.prisma.citas.findMany({
      where: {
        fechaHora: {
          gte: fechaInicio,
          lt: fechaFin,
        },
      },
    });

    const horariosOcupados = citasExistentes.map((cita) =>
      new Date(cita.fechaHora).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      }),
    );

    return todosLosHorarios.filter(
      (horario) => !horariosOcupados.includes(horario),
    );
  }

  private generarHorarios(): string[] {
    const horarios: string[] = [];

    for (let hora = 10; hora < 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        horarios.push(
          `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`,
        );
      }
    }

    return horarios;
  }

  async markAsCompleted(id: number) {
    return this.prisma.citas.update({
      where: { id },
      data: { completada: true },
    });
  }
}

