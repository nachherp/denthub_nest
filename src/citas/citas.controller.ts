import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/crear-cita.dto';

@Controller('citas')
@UseGuards(JwtAuthGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @Get('paciente/:pacienteId')
  findByPaciente(@Param('pacienteId') pacienteId: string) {
    console.log('Buscando citas para el paciente:', pacienteId);
    return this.citasService.findByPaciente(+pacienteId);
  }

  @Get('pendientes')
  findPending() {
    return this.citasService.findPending();
  }

  @Get('completadas')
  findCompleted() {
    return this.citasService.findCompleted();
  }

  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: Partial<CreateCitaDto>) {
    return this.citasService.update(+id, updateCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }

  @Get('dashboard')
  getDashboardData() {
    return this.citasService.getDashboardData();
  }
}

