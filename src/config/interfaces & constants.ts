export enum environments {
  production = 'production',
  development = 'development',
  test = 'test',
}

export interface config {
  NODE_ENV: environments;
  PORT: number;
  DATABASE_URL: string;
  DIRECT_URL: string;
  JWT_ACCESS_EXPIRATION: number;
  JWT_REFRESH_EXPIRATION: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  ENABLE_PRISMA_LOGGING: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URL: string;
  TWITTER_CONSUMER_KEY: string;
  TWITTER_CONSUMER_SECRET: string;
  TWITTER_OAUTH_CALLBACK: string;
  OLA_MAPS_API_KEY: string;
  RAZOR_PAY_KEY_ID: string;
  RAZOR_PAY_KEY_SECRET: string;
  ENABLE_NG_ROK: boolean;
  NGROK_AUTHTOKEN: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  STRIPE_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}
