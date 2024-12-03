import { Test, TestingModule } from '@nestjs/testing';
import { DentistaService } from './dentista.service';

describe('DentistService', () => {
  let service: DentistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DentistaService],
    }).compile();

    service = module.get<DentistaService>(DentistaService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });
});
