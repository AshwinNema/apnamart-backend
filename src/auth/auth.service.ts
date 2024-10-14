import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginValidator, RegisterAdminValidator } from 'src/validations';
import { TokenService } from 'src/auth/token/token.service';
import { AdminService } from 'src/user-entites/admin/admin.service';
import { UserService } from 'src/user-entites/user/user.service';

import { UserRole } from '@prisma/client';
import prisma from 'src/prisma/client';
import { getLoginOptions } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async registerAdmin(adminDetails: RegisterAdminValidator) {
    const admin = await this.adminService.registerAdmin(adminDetails);
    const adminId = Array.isArray(admin) ? admin[0].id : admin.id;
    const tokens = await this.tokenService.generateAuthTokens(adminId);
    return {
      user: {
        ...admin,
        role: UserRole.admin,
      },
      tokens,
    };
  }

  async login(loginCredentails: LoginValidator) {
    const user = await this.userService.findUnique(
      { email: loginCredentails.email },
      getLoginOptions(loginCredentails.role),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { id: userId, password, userRoles } = user;
    if (!password) {
      throw new BadRequestException(
        'You have not setted your password yet. Please login through twitter/google and set your password first',
      );
    }
    delete user.password;

    const isPasswordMatch = await prisma.user.isPasswordMatch(
      loginCredentails.password,
      password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    if (!userRoles.includes(loginCredentails.role)) {
      throw new BadRequestException(
        'User does not have sufficient role permissions',
      );
    }

    const tokens = await this.tokenService.generateAuthTokens(userId);

    return {
      user: { ...user, role: loginCredentails.role },
      tokens,
    };
  }
}
