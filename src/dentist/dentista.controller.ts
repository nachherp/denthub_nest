import { Controller, Get, Put, UseGuards, Request, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DentistaService } from './dentista.service';

@Controller('dentista')
@UseGuards(JwtAuthGuard)
export class DentistaController {
  constructor(private readonly dentistaService: DentistaService) {}

  @Get('perfil')
  async obtenerPerfil(@Request() req) {
    console.log('Headers recibidos:', req.headers);
    console.log('Token en controller:', req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token extraído:', token);
    return this.dentistaService.obtenerPerfil(token);
  }

  @Put('perfil/:id')
  async actualizarPerfil(@Param('id') id: string, @Body() datosActualizados: any, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.dentistaService.actualizarPerfil(parseInt(id), datosActualizados, token);
  }
}

