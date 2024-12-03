import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServiciosService } from './servicios.service';

@Controller('servicios')
export class ServiciosController {
  constructor(private serviciosService: ServiciosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.serviciosService.findAll();
  }
}

