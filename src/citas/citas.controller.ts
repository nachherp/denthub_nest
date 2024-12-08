import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/crear-cita.dto';

@Controller('citas')
@UseGuards(JwtAuthGuard) // Protege todos los endpoints con JWT
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  // Obtener todas las citas
  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  // Obtener las citas de un paciente específico
  @Get('paciente/:pacienteId')
  async findByPaciente(@Param('pacienteId') pacienteId: string) {
    if (!pacienteId) {
      throw new BadRequestException('El ID del paciente es obligatorio');
    }
    console.log('Buscando citas para el paciente:', pacienteId);
    return this.citasService.findByPaciente(+pacienteId);
  }

  // Obtener citas pendientes
  @Get('pendientes')
  findPending() {
    return this.citasService.findPending();
  }

  // Obtener citas completadas
  @Get('completadas')
  findCompleted() {
    return this.citasService.findCompleted();
  }

  // Crear una nueva cita
  @Post()
  async create(@Body() createCitaDto: CreateCitaDto) {
    if (!createCitaDto.fechaHora || !createCitaDto.servicioId || !createCitaDto.pacienteId) {
      throw new BadRequestException('Todos los campos son obligatorios');
    }
    console.log('Creando nueva cita:', createCitaDto);
    return this.citasService.create(createCitaDto);
  }

  // Actualizar una cita existente
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCitaDto: Partial<CreateCitaDto>) {
    if (!id) {
      throw new BadRequestException('El ID de la cita es obligatorio');
    }
    console.log('Actualizando cita con ID:', id);
    return this.citasService.update(+id, updateCitaDto);
  }

  // Eliminar una cita
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('El ID de la cita es obligatorio');
    }
    console.log('Eliminando cita con ID:', id);
    return this.citasService.remove(+id);
  }

  // Obtener datos del dashboard
  @Get('dashboard')
  getDashboardData() {
    return this.citasService.getDashboardData();
  }

  // Obtener disponibilidad de horarios
  @Get('disponibilidad')
  async getDisponibilidad(@Query('fecha') fecha: string) {
    if (!fecha) {
      throw new BadRequestException('La fecha es obligatoria');
    }
    console.log('Consultando disponibilidad para la fecha:', fecha);
    return this.citasService.obtenerDisponibilidad(fecha);
  }

  // Marcar una cita como completada
  @Put(':id/complete')
  async markAsCompleted(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('El ID de la cita es obligatorio');
    }
    console.log('Marcando cita como completada, ID:', id);
    return this.citasService.markAsCompleted(+id);
  }
}

