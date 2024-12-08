import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto, UpdatePacienteDto, UpdatePerfilBasicoDto } from './dto/paciente.dto';

@Controller('pacientes')
@UseGuards(JwtAuthGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(+id);
  }

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updatePacienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }

  @Get('dashboard/data')
  async getDashboardData() {
    return this.pacientesService.getDashboardData();
  }

  @Put(':id/perfil')
  updatePerfil(@Param('id') id: string, @Body() updatePerfilBasicoDto: UpdatePerfilBasicoDto) {
    return this.pacientesService.updatePerfilBasico(+id, updatePerfilBasicoDto);
  }
}

