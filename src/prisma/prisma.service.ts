import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
      
      // Verificar la conexión con una consulta simple
      const result = await this.paciente.findMany({
        take: 1
      });
      this.logger.log(`Database test query result: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }
}