import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { PrismaModule } from './prisma/prisma.module';
import { CitasModule } from './citas/citas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { DentistaModule } from './dentist/dentista.module';

@Module({
  imports: [
    AuthModule,
    

    PrismaModule,
    CitasModule,
    ServiciosModule,
    PacientesModule,
    DentistaModule,
  ],
})
export class AppModule {}
