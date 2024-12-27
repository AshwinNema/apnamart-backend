import { Test, TestingModule } from '@nestjs/testing';
import { Checkout3Service } from './checkout3.service';

describe('Checkout3Service', () => {
  let service: Checkout3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Checkout3Service],
    }).compile();

    service = module.get<Checkout3Service>(Checkout3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
