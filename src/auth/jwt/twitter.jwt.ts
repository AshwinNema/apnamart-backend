import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as TwitterTokenStrategy from 'passport-twitter-token';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { OtherTokenTypes } from 'src/utils';
import { UserService } from 'src/user-entites/user/user.service';
import { UserRole } from '@prisma/client';
import { authAccessType } from 'src/validations';
import { getLoginOptions, otherAuthChecks } from '../utils';

@Injectable()
export class TwitterAcessStrategy extends PassportStrategy(
  TwitterTokenStrategy,
  OtherTokenTypes.twitter,
) {
  constructor(private userService: UserService) {
    super(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        includeEmail: true,
        passReqToCallback: true,
      },
      async (req, token, tokenSecret, profile, done) => {
        try {
          const role = req.query.role as UserRole;
          const accessType = req.query.accessType as authAccessType;
          const email = profile?.emails?.[0]?.value || '';
          if (!email) {
            return done(
              new BadRequestException('Email of the user not found in profile'),
              profile,
            );
          }
          const user = await this.userService.findUnique(
            { email },
            getLoginOptions(role),
          );
          const err = otherAuthChecks(accessType, user, role, true);
          if (err) {
            return done(new BadRequestException(err), profile);
          }
          const profileDetails = {
            email,
            name: profile.displayName,
            userDetails: user,
          };
          done(null, profileDetails);
        } catch (err) {
          done(err, false);
        }
      },
    );
  }
}

@Injectable()
export class TwitterAccessAuthGuard extends AuthGuard(OtherTokenTypes.twitter) {
  constructor() {
    super({});
  }
  handleRequest<TUser = any>(
    err: any,
    profile: any,
    // info: any,
    // context: ExecutionContext,
    // status?: any,
  ): TUser {
    if (err || !profile) {
      throw err || new UnauthorizedException();
    }
    return profile;
  }
}
