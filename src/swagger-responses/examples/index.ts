import { UserRole } from '@prisma/client';
import {
  customerLoginResponse,
  merchantLoginResponse,
  adminLoginExample,
} from './login';
import { ApiResponseExamples } from '@nestjs/swagger';

export * from './login';

export const tokenExample = {
  access: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTczOTAyODk4MCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTczNjQzNjk4MH0.xjIHYjczT8Sb5lwzU8bTF_YVSAluAKTX22SJa26s4zA',
    expires: '2025-02-08T15:36:20.171Z',
  },
  refresh: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTczOTAyODk4MCwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzY0MzY5ODB9.RHsx98djSp7TMO1xdwMwdyANXpAREwMaebJubZJIVWY',
    expires: '2025-02-08T15:36:20.171Z',
  },
};

export const registeredAdminExample = {
  id: 1,
  userRoles: [UserRole.admin],
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: UserRole.admin,
};

export const loginExamples: { [key: string]: ApiResponseExamples } = {
  customer: {
    summary: 'Customer',
    value: {
      user: customerLoginResponse,
      tokens: tokenExample,
    },
  },
  merchant: {
    summary: 'Merchant',
    value: {
      user: merchantLoginResponse,
      tokens: tokenExample,
    },
  },
  admin: {
    summary: 'Admin',
    value: {
      user: adminLoginExample,
      tokens: tokenExample,
    },
  },
};
