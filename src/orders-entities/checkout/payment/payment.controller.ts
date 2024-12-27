import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RazorPayPaymentValidation } from 'src/validations/checkout-validation/payment.validation';
import { User } from 'src/decorators';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('verify-razorpay-signature/:sessionId')
  verifyRazorPaySignature(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() body: RazorPayPaymentValidation,
    @User() user,
  ) {
    return this.paymentService.verifyRazorpaySignature(
      body,
      sessionId,
      user.id,
    );
  }
}
