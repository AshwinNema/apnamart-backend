import { Test, TestingModule } from '@nestjs/testing';
import { MerchantAdminChatService } from './merchant-admin-chat.service';

describe('MerchantAdminChatService', () => {
  let service: MerchantAdminChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantAdminChatService],
    }).compile();

    service = module.get<MerchantAdminChatService>(MerchantAdminChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
