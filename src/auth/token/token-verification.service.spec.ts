import { Test, TestingModule } from '@nestjs/testing';
import { TokenVerificationService } from './token-verification.service';

describe('TokenVerificationService', () => {
  let service: TokenVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenVerificationService],
    }).compile();

    service = module.get<TokenVerificationService>(TokenVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
