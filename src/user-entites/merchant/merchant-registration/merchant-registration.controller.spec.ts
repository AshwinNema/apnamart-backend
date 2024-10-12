import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRegistrationController } from './merchant-registration.controller';

describe('MerchantRegistrationController', () => {
  let controller: MerchantRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantRegistrationController],
    }).compile();

    controller = module.get<MerchantRegistrationController>(
      MerchantRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
