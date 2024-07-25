import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { google } from 'googleapis';
import { GoogleAuth } from 'src/validations';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user-entites/user/user.service';
import { UserRole } from '@prisma/client';
import { UserInterface } from 'src/interfaces';

// checks in the function -
// 1. If user is not present in the system and user role is admin, then we throw an error because admin creation is not allowed
// 2. User cannot be assigned admin role, so if user is not an admin
@Injectable()
export class GoogleAuthService {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async googleLoginSignUp({ token, role }: GoogleAuth) {
    const googleCredentails = this.configService.get('google');

    const oauth2Client = new google.auth.OAuth2(
      googleCredentails.clientId,
      googleCredentails.clientSecret,
      googleCredentails.redirectUrl,
    );

    oauth2Client.setCredentials({ access_token: token });

    const profile = google.people({ version: 'v1', auth: oauth2Client });
    const profileDetails = await profile.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });
    const profileData = profileDetails?.data;
    const email = profileData?.emailAddresses?.[0]?.value;
    const userName = profileData?.names?.[0]?.displayName || 'New User';
    let user: UserInterface = await this.userService.findUnique({ email });

    // Check as per point 1.
    if (!user && role === UserRole.admin) {
      throw new BadRequestException('Admin user not present in the system');
    }

    // Check as per point 2.
    if (
      user &&
      role === UserRole.admin &&
      !user.userRoles.includes(UserRole.admin)
    ) {
      throw new BadRequestException('Existing user cannot be made an admin');
    }

    if (!user) {
      user = (await this.userService.createUser({
        name: userName,
        email,
        userRoles: [role],
      })) as UserInterface;
    }

    if (!user.userRoles.includes(role)) {
      this.userService.updateUser(
        { id: user.id },
        {
          UserRoles: {
            push: role,
          },
        },
      );
    }

    const tokens = await this.tokenService.generateAuthTokens(user.id);
    return {
      user: { ...user, role },
      tokens,
    };
  }
}
