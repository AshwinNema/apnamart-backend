import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCartService } from './customer-cart.service';

describe('CustomerCartService', () => {
  let service: CustomerCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerCartService],
    }).compile();

    service = module.get<CustomerCartService>(CustomerCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
