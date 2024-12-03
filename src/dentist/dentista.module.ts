import { Module } from '@nestjs/common';
import { DentistaController } from './dentista.controller';
import { DentistaService } from './dentista.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'tu_clave_secreta_temporal', // Asegúrate de que este sea el mismo secreto que usas en AuthModule
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [DentistaController],
  providers: [DentistaService],
})
export class DentistaModule {}

