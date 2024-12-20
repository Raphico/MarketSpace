import Joi from "joi";

/**
 * @description
 * This object defines the available authentication methods (or "strategies") that a user can use to log in or register in the application.
 * It maps each method to a constant string for consistency and type safety across the codebase.
 *
 * @type {{ GOOGLE: "google"; EMAIL_PASSWORD: "email_password"} as const}
 */
export const STRATEGY = Object.freeze({
    GOOGLE: "google",
    EMAIL_PASSWORD: "email_password",
});

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test"),
    PORT: Joi.string().default("8000"),

    DATABASE_URL: Joi.string().uri(),
    REDIS_URL: Joi.string().uri(),

    MAILTRAP_SMTP_HOST: Joi.string(),
    MAILTRAP_SMTP_PORT: Joi.string(),
    MAILTRAP_SMTP_USERNAME: Joi.string(),
    MAILTRAP_SMTP_PASSWORD: Joi.string(),
    SENDER_EMAIL_ADDRESS: Joi.string(),

    REFRESH_TOKEN_SECRET: Joi.string(),
    ACCESS_TOKEN_SECRET: Joi.string(),
    ACCESS_TOKEN_EXPIRY: Joi.string(),
    REFRESH_TOKEN_EXPIRY: Joi.string(),
    VERIFICATION_TOKEN_EXPIRY: Joi.number().default(20 * 60 * 100),

    GOOGLE_CALLBACK_URL: Joi.string().uri(),
    GOOGLE_CLIENT_ID: Joi.string(),
    GOOGLE_CLIENT_SECRET: Joi.string(),

    CLIENT_URL: Joi.string().uri(),
    CLIENT_SSO_REDIRECT_URL: Joi.string().uri(),

    CLOUDINARY_API_KEY: Joi.string(),
    CLOUDINARY_CLOUD_NAME: Joi.string(),
    CLOUDINARY_API_SECRET: Joi.string(),

    ADMIN_USERNAME: Joi.string(),
    ADMIN_PASSWORD: Joi.string(),
    ADMIN_EMAIL: Joi.string().email(),
});

const { error, value: env } = envSchema.validate({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,

    MAILTRAP_SMTP_HOST: process.env.MAILTRAP_SMTP_HOST,
    MAILTRAP_SMTP_PORT: process.env.MAILTRAP_SMTP_PORT,
    MAILTRAP_SMTP_USERNAME: process.env.MAILTRAP_SMTP_USERNAME,
    MAILTRAP_SMTP_PASSWORD: process.env.MAILTRAP_SMTP_PASSWORD,
    SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    VERIFICATION_TOKEN_EXPIRY: process.env.VERIFICATION_TOKEN_EXPIRY,

    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    CLIENT_URL: process.env.CLIENT_URL,
    CLIENT_SSO_REDIRECT_URL: process.env.CLIENT_SSO_REDIRECT_URL,

    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
});

if (error) {
    throw Error(error);
}

export { env };
