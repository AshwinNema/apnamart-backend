import { Test, TestingModule } from '@nestjs/testing';
import { Product2Service } from './product2.service';

describe('Product2Service', () => {
  let service: Product2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Product2Service],
    }).compile();

    service = module.get<Product2Service>(Product2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
