import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto/paciente.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma } from '@prisma/client';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paciente.findMany();
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { procedimientosAnteriores: true },
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async create(createPacienteDto: CreatePacienteDto) {
    return this.prisma.paciente.create({
      data: createPacienteDto,
    });
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.findOne(id);

    let data: any = { ...updatePacienteDto };

    if (updatePacienteDto.tratamientoCompletado && paciente.motivoConsulta) {
      // Move current treatment to procedimientosAnteriores
      data.procedimientosAnteriores = {
        create: {
          descripcion: paciente.motivoConsulta,
          fechaRealizacion: new Date(),
        },
      };
      data.motivoConsulta = null; // Clear current treatment
      data.tratamientoCompletado = false; // Reset treatment completed status
    }

    return this.prisma.paciente.update({
      where: { id },
      data,
      include: { procedimientosAnteriores: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si el paciente existe
    return this.prisma.paciente.delete({
      where: { id },
    });
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    const paciente = await this.findOne(id);
    
    // Crear directorio si no existe
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'profile-images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generar nombre de archivo único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${paciente.id}-${uniqueSuffix}${path.extname(file.originalname)}`;
    
    // Guardar archivo
    const filepath = path.join(uploadPath, filename);
    fs.writeFileSync(filepath, file.buffer);

    // Actualizar paciente con nueva ruta de imagen
    const imageUrl = `/profile-images/${filename}`;
    await this.prisma.paciente.update({
      where: { id },
      data: { fotoPerfil: imageUrl },
    });

    return imageUrl;
  }

  async getDashboardData() {
    const totalPacientes = await this.prisma.paciente.count();
    
    const pacientes = await this.prisma.paciente.findMany({
      select: {
        fechaNacimiento: true,
        sexo: true,
      },
    });

    const ageDistribution = this.calculateAgeDistribution(pacientes);
    const sexDistribution = await this.prisma.paciente.groupBy({
      by: ['sexo'],
      _count: {
        _all: true
      },
    });

    return {
      metrics: {
        totalPacientes,
      },
      ageDistribution,
      sexDistribution: sexDistribution.map(item => ({
        sex: item.sexo,
        count: item._count._all
      }))
    };
  }

  private calculateAgeDistribution(pacientes: { fechaNacimiento: Date; sexo: string }[]) {
    const ageGroups = {
      '0-18': { Masculino: 0, Femenino: 0 },
      '19-30': { Masculino: 0, Femenino: 0 },
      '31-50': { Masculino: 0, Femenino: 0 },
      '51+': { Masculino: 0, Femenino: 0 },
    };

    pacientes.forEach(paciente => {
      const age = this.calculateAge(paciente.fechaNacimiento);
      const sex = paciente.sexo;
      let ageGroup;

      if (age <= 18) ageGroup = '0-18';
      else if (age <= 30) ageGroup = '19-30';
      else if (age <= 50) ageGroup = '31-50';
      else ageGroup = '51+';

      if (sex === 'Masculino' || sex === 'Femenino') {
        ageGroups[ageGroup][sex]++;
      }
    });

    return Object.entries(ageGroups).map(([ageGroup, counts]) => ({
      ageGroup,
      Masculino: counts.Masculino,
      Femenino: counts.Femenino,
    }));
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}