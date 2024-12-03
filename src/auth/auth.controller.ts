import { Controller, Post, Body, ConflictException, InternalServerErrorException, UnauthorizedException, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    try {
      return await this.authService.register(userData);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException('Error en el servidor durante el registro');
    }
  }

  @Post('login')
  async login(@Body() loginData: { correoElectronico: string; contrasena: string; role: string }) {
    console.log('Login attempt:', loginData); 
    try {
      const result = await this.authService.login(
        loginData.correoElectronico,
        loginData.contrasena,
        loginData.role
      );
      console.log('Login result:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

