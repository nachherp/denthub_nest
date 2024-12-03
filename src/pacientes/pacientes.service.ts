import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto/paciente.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paciente.findMany();
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
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
    await this.findOne(id); // Verifica si el paciente existe
    return this.prisma.paciente.update({
      where: { id },
      data: updatePacienteDto,
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
}

