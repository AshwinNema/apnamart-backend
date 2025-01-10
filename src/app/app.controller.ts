import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

import { SkipAccessAuth } from 'src/auth/jwt/access.jwt';

class HealthyReponse {
  @ApiProperty({
    enum: { health: 'Health' },
    description: 'Service is running fine',
  })
  status: 'Health';
}

@Controller()
export class AppController {
  constructor() {}

  @SkipAccessAuth()
  @Get('health')
  @ApiResponse({
    status: 200,
    description: 'Service is running fine',
    type: HealthyReponse,
  })
  health() {
    return { status: 'Health' };
  }
}
