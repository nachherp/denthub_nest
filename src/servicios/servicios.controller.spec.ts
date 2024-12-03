import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosController } from './servicios.controller';

describe('ServiciosController', () => {
  let controller: ServiciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosController],
    }).compile();

    controller = module.get<ServiciosController>(ServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
