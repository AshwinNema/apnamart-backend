import { Test, TestingModule } from '@nestjs/testing';
import { MerchantAdminChatHelperService } from './helper.service';

describe('MerchantAdminChatHelperService', () => {
  let service: MerchantAdminChatHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantAdminChatHelperService],
    }).compile();

    service = module.get<MerchantAdminChatHelperService>(
      MerchantAdminChatHelperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
