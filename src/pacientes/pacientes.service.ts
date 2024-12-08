import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePacienteDto, UpdatePacienteDto, UpdatePerfilBasicoDto } from './dto/paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paciente.findMany();
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: {
        procedimientosAnteriores: true
      }
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async create(createPacienteDto: CreatePacienteDto) {
    const { procedimientosAnteriores, ...pacienteData } = createPacienteDto;
    return this.prisma.paciente.create({
      data: {
        ...pacienteData,
        procedimientosAnteriores: procedimientosAnteriores
      },
      include: {
        procedimientosAnteriores: true
      }
    });
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const { procedimientosAnteriores, ...otherData } = updatePacienteDto;

    const updateData: Prisma.pacienteUpdateInput = {
      ...otherData,
    };

    if (procedimientosAnteriores) {
      updateData.procedimientosAnteriores = {
        create: procedimientosAnteriores.create,
        update: procedimientosAnteriores.update,
        delete: procedimientosAnteriores.delete,
      };
    }

    try {
      return await this.prisma.paciente.update({
        where: { id },
        data: updateData,
        include: {
          procedimientosAnteriores: true
        }
      });
    } catch (error) {
      console.error('Error al actualizar el paciente:', error);
      throw new Error('No se pudo actualizar el paciente. Por favor, revise los datos e intente de nuevo.');
    }
  }

  async remove(id: number) {
    const paciente = await this.findOne(id);
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    try {
      // Start a transaction
      return await this.prisma.$transaction(async (prisma) => {
        // Delete related records
        await prisma.citas.deleteMany({ where: { pacienteId: id } });
        await prisma.procedimientoAnterior.deleteMany({ where: { pacienteId: id } });
        // Add more deleteMany operations for other related tables if necessary

        // Finally, delete the patient
        return prisma.paciente.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException('No se puede eliminar el paciente debido a registros relacionados.');
        }
      }
      throw error;
    }
  }

  async getDashboardData() {
    const totalPacientes = await this.prisma.paciente.count();
  
    const pacientes = await this.prisma.paciente.findMany({
      select: {
        fechaNacimiento: true,
        sexo: true,
      },
    });

    const distribucionEdades = this.calcularDistribucionEdades(pacientes);
    const distribucionSexos = await this.prisma.paciente.groupBy({
      by: ['sexo'],
      _count: {
        _all: true
      },
    });

    return {
      metrics: {
        totalPacientes,
      },
      distribucionEdades,
      distribucionSexos: distribucionSexos.map(item => ({
        sexo: item.sexo,
        cantidad: item._count._all
      }))
    };
  }

  private calcularDistribucionEdades(pacientes: { fechaNacimiento: Date; sexo: string }[]) {
    const gruposEdades = {
      '0-18': { Masculino: 0, Femenino: 0 },
      '19-30': { Masculino: 0, Femenino: 0 },
      '31-50': { Masculino: 0, Femenino: 0 },
      '51+': { Masculino: 0, Femenino: 0 },
    };

    pacientes.forEach(paciente => {
      const edad = this.calcularEdad(paciente.fechaNacimiento);
      const sexo = paciente.sexo;
      let grupoEdad;

      if (edad <= 18) grupoEdad = '0-18';
      else if (edad <= 30) grupoEdad = '19-30';
      else if (edad <= 50) grupoEdad = '31-50';
      else grupoEdad = '51+';

      if (sexo === 'Masculino' || sexo === 'Femenino') {
        gruposEdades[grupoEdad][sexo]++;
      }
    });

    return Object.entries(gruposEdades).map(([grupoEdad, conteo]) => ({
      grupoEdad,
      Masculino: conteo.Masculino,
      Femenino: conteo.Femenino,
    }));
  }

  private calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  async updatePerfilBasico(id: number, updatePerfilBasicoDto: UpdatePerfilBasicoDto) {
    return this.prisma.paciente.update({
      where: { id },
      data: updatePerfilBasicoDto,
    });
  }
}

