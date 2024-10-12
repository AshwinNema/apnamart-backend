import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleAuth } from 'src/validations';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user-entites/user/user.service';
import { UserInterface } from 'src/interfaces';
import { TokenService2 } from '../token/token2.service';
import { getLoginOptions, otherAuthChecks } from '../utils';

// checks in the function -
// 1. If user is not present in the system and user role is admin, then we throw an error because admin creation is not allowed
// 2. User cannot be assigned admin role, so if user is not an admin
@Injectable()
export class GoogleAuthService {
  constructor(
    private tokenService: TokenService2,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async googleLoginSignUp({ token, role, accessType }: GoogleAuth) {
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
    const user: UserInterface = await this.userService.findUnique(
      { email },
      getLoginOptions(role),
    );

    otherAuthChecks(accessType, user, role);
    return this.tokenService.generateDifferentLoginToken(user, {
      role,
      name: userName,
      email,
    });
  }
}
