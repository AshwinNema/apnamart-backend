import { Test, TestingModule } from '@nestjs/testing';
import { MerchantAdminChatGateway } from './merchant-admin-chat.gateway';

describe('MerchantAdminChatGateway', () => {
  let gateway: MerchantAdminChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantAdminChatGateway],
    }).compile();

    gateway = module.get<MerchantAdminChatGateway>(MerchantAdminChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
