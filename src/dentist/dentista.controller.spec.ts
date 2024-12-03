import { Test, TestingModule } from '@nestjs/testing';
import { DentistaController } from './dentista.controller';

describe('DentistController', () => {
  let controller: DentistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DentistaController],
    }).compile();

    controller = module.get<DentistaController>(DentistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
