import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const [totalCitas, citasCompletadas, citasPorServicio] = await Promise.all([
      this.prisma.citas.count(),
      this.prisma.citas.count({
        where: {
          fechaHora: {
            lt: new Date(),
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

    const citasPendientes = totalCitas - citasCompletadas;

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

