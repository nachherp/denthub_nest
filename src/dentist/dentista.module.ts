import { Module } from '@nestjs/common';
import { DentistaController } from './dentista.controller';
import { DentistaService } from './dentista.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: '12345', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [DentistaController],
  providers: [DentistaService],
})
export class DentistaModule {}

