import { Test, TestingModule } from '@nestjs/testing';
import { Checkout2Service } from './checkout2.service';

describe('Checkout2Service', () => {
  let service: Checkout2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Checkout2Service],
    }).compile();

    service = module.get<Checkout2Service>(Checkout2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
