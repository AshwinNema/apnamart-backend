import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginValidation, registerUser } from 'src/validations';
import { TokenService } from 'src/token/token.service';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeUserFields } from 'src/utils';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private tokenService: TokenService,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async registerAdmin(adminDetails: registerUser) {
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

  async login(loginCredentails: loginValidation) {
    const user = await this.userService.findUnique(
      { email: loginCredentails.email },
      false,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { id: userId, password } = Array.isArray(user) ? user[0] : user;
    const isPasswordMatch =
      await this.prismaService.prisma.user.isPasswordMatch(
        loginCredentails.password,
        password,
      );
    user.role = loginCredentails.role;
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = await this.tokenService.generateAuthTokens(userId);
    return {
      user: excludeUserFields(user),
      tokens,
    };
  }
}