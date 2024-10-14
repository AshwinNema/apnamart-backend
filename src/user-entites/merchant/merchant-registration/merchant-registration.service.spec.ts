import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRegistrationService } from './merchant-registration.service';

describe('MerchantRegistrationService', () => {
  let service: MerchantRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantRegistrationService],
    }).compile();

    service = module.get<MerchantRegistrationService>(
      MerchantRegistrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
