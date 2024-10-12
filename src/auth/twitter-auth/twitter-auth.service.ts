import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import addOAuthInterceptor, { OAuthInterceptorConfig } from 'axios-oauth-1.0a';
import endpoints from 'src/utils/endpoints';
import {
  twitterAccessTokenResponse,
  parseTwitterTokenResponse,
  twitterRequestTokenResponse,
} from '../utils';
import { TwitterAccessToken } from 'src/validations';
import { NextFunction } from 'express';
import * as _ from 'lodash';

@Injectable()
export class TwitterAuthService {
  twitterCredetials: {
    consumer_key: string;
    consumer_secret: string;
    oauth_callback: string;
  };
  constructor(private configService: ConfigService) {
    this.twitterCredetials = this.configService.get('twitter');
    const { consumer_key, consumer_secret } = this.twitterCredetials;
    const axiosOptions: OAuthInterceptorConfig = {
      algorithm: 'HMAC-SHA1',
      key: consumer_key,
      secret: consumer_secret,
    };

    addOAuthInterceptor(axios, axiosOptions);
  }

  async requestToken() {
    const { consumer_key, consumer_secret, oauth_callback } =
      this.twitterCredetials;
    const token = await axios.post(endpoints.twitterRequestToken, {
      oauth_callback,
      consumer_key,
      consumer_secret,
    });
    const parsedResponse: twitterRequestTokenResponse =
      parseTwitterTokenResponse(token.data) as twitterRequestTokenResponse;
    if (parsedResponse.oauth_callback_confirmed !== 'true') {
      throw new BadRequestException('Something went wrong');
    }
    return parsedResponse;
  }

  async generateAccessToken(
    query: TwitterAccessToken,
    req: Request,
    next: NextFunction,
  ) {
    const twitterQuery = _.pick(query, ['oauth_token', 'oauth_verifier']);
    const response = await axios.post(
      endpoints.twitterAccessToken(twitterQuery),
    );
    const parsedResponse = parseTwitterTokenResponse(
      response.data,
    ) as twitterAccessTokenResponse;
    req.body['oauth_token'] = parsedResponse.oauth_token;
    req.body['oauth_token_secret'] = parsedResponse.oauth_token_secret;
    req.body['user_id'] = parsedResponse.user_id;
    next();
  }
}
