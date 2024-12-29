import { Body, Controller, Post, Req } from '@nestjs/common';
import { RazorPayPaymentValidation } from 'src/validations/checkout-validation/payment.validation';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';
import { RazorpayPaymentService } from '../razorpay-payment/razorpay-payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private razorpayPaymentService: RazorpayPaymentService) {}

  @Post('verify-razorpay-signature')
  verifyRazorPaySignature(@Body() body: RazorPayPaymentValidation) {
    return this.razorpayPaymentService.verifyRazorpaySignature(body);
  }

  @SkipAccessAuth()
  @Post('razorpay-webhook')
  razorPayWebhook(@Req() req, @Body() body) {
    return this.razorpayPaymentService.validateRazorpayPayment(
      req.headers['x-razorpay-signature'],
      body,
    );
  }
}
