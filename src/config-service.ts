import * as Joi from 'joi';

export const config = {
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
  //ignoreEnvFile: process.env.NODE_ENV === 'prod',
  validationSchema: Joi.object({
    PRIVATE_KEY: Joi.string().required(),
    POSTGRES_URL: Joi.string().required(),
    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_DOMAIN: Joi.string().required(),
    MAILGUN_FROM_EMAIL: Joi.string().required(),
    AWS_KEY: Joi.string().required(),
    AWS_SECRET: Joi.string().required(),
  }),
};
