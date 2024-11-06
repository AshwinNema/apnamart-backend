import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @SkipAccessAuth()
  @Get('category-subcategory-item-menu')
  async getCategorySubCategoryItemFilter() {
    return this.customerService.getCategorySubCategoryItemMenu();
  }
}
