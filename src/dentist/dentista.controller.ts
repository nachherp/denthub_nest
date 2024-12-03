import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}

