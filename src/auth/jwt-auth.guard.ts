import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // logs porque tengo un error
    console.log('JWT Guard - Error:', err);
    console.log('JWT Guard - User:', user);
    console.log('JWT Guard - Info:', info);
    
    if (err || !user) {
      throw err || new UnauthorizedException('No autorizado');
    }
    return user;
  }
}

