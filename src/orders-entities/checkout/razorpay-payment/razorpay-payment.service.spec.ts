import { Test, TestingModule } from '@nestjs/testing';
import { RazorpayPaymentService } from './razorpay-payment.service';

describe('RazorpayPaymentService', () => {
  let service: RazorpayPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RazorpayPaymentService],
    }).compile();

    service = module.get<RazorpayPaymentService>(RazorpayPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
