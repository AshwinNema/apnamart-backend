import { z } from 'zod';

export enum environments {
  production = 'production',
  development = 'development',
  test = 'test',
}
interface config {
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
}

const envVarsSchema = z.object({
  NODE_ENV: z.enum([
    environments.production,
    environments.development,
    environments.test,
  ]),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  JWT_ACCESS_EXPIRATION: z.coerce.number(),
  JWT_REFRESH_EXPIRATION: z.coerce.number(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  ENABLE_PRISMA_LOGGING: z.coerce.boolean().default(false),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),
  TWITTER_CONSUMER_KEY: z.string(),
  TWITTER_CONSUMER_SECRET: z.string(),
  TWITTER_OAUTH_CALLBACK: z.string(),
  OLA_MAPS_API_KEY: z.string(),
  RAZOR_PAY_KEY_ID: z.string(),
  RAZOR_PAY_KEY_SECRET: z.string(),
});

export const validateConfig = (config: config) => {
  const configuration = envVarsSchema.parse(config);

  return {
    env: configuration.NODE_ENV,
    port: configuration.PORT,
    jwt: {
      access_secret: configuration.JWT_ACCESS_SECRET,
      refresh_secret: configuration.JWT_REFRESH_SECRET,
      accessTokenExpiration: configuration.JWT_ACCESS_EXPIRATION,
      refreshTokenExpiration: configuration.JWT_REFRESH_EXPIRATION,
    },
    cloudinary: {
      cloud_name: configuration.CLOUDINARY_CLOUD_NAME,
      api_key: configuration.CLOUDINARY_API_KEY,
      api_secret: configuration.CLOUDINARY_API_SECRET,
    },
    prisma: {
      enable_logging: configuration.ENABLE_PRISMA_LOGGING,
    },
    google: {
      clientId: configuration.GOOGLE_CLIENT_ID,
      clientSecret: configuration.GOOGLE_CLIENT_SECRET,
      redirectUrl: configuration.GOOGLE_REDIRECT_URL,
    },
    twitter: {
      consumer_key: configuration.TWITTER_CONSUMER_KEY,
      consumer_secret: configuration.TWITTER_CONSUMER_SECRET,
      oauth_callback: configuration.TWITTER_OAUTH_CALLBACK,
    },
    ola_maps: {
      api_key: configuration.OLA_MAPS_API_KEY,
    },
    razorPay: {
      key_id: configuration.RAZOR_PAY_KEY_ID,
      key_secret: configuration.RAZOR_PAY_KEY_SECRET,
    },
  };
};

export const envConfig: z.infer<typeof envVarsSchema> | undefined =
  envVarsSchema.safeParse(process.env)?.data;
