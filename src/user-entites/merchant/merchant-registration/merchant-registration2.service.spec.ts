import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRegistration2Service } from './merchant-registration2.service';

describe('MerchantRegistration2Service', () => {
  let service: MerchantRegistration2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantRegistration2Service],
    }).compile();

    service = module.get<MerchantRegistration2Service>(
      MerchantRegistration2Service,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
