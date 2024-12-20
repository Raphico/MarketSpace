import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { logger } from "../loggers/winston.logger.js";
import { env } from "../config.js";

/**
 * Sends an email using the provided details and Mailgen content
 *
 * @export
 * @async
 * @param {{ email: string; subject: string; emailContent: Mailgen.Content; }} options
 */
export async function sendEmail({ email, subject, emailContent }) {
    try {
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "MarketSpace",
                link: "https://github.com/raphico",
            },
        });

        const transporter = nodemailer.createTransport({
            host: env.MAILTRAP_SMTP_HOST,
            port: env.MAILTRAP_SMTP_PORT,
            secure: env.MAILTRAP_SMTP_PORT == "465",
            auth: {
                user: env.MAILTRAP_SMTP_USERNAME,
                pass: env.MAILTRAP_SMTP_PASSWORD,
            },
        });

        // Generate an HTML email with the provided contents
        const emailBody = mailGenerator.generate(emailContent);

        // Generate the plaintext version of the e-mail (for clients that do not support HTML)
        const emailText = mailGenerator.generatePlaintext(emailContent);

        transporter.sendMail({
            from: env.SENDER_EMAIL_ADDRESS,
            to: email,
            subject,
            text: emailText,
            html: emailBody,
        });
    } catch (error) {
        // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
        // So it's better to fail silently rather than breaking the app
        logger.error(
            "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
        );
        logger.error(error);
    }
}

/**
 * Generates the email content template for user email verification
 *
 * @export
 * @param {{ username: string; verificationUrl: string; }} options
 * @returns {Mailgen.Content}
 */
export function emailVerificationTemplate({ username, verificationUrl }) {
    const expiresIn = env.VERIFICATION_TOKEN_EXPIRY / 60000;

    return {
        body: {
            name: username,
            intro: "Thank you for registering with MarketSpace! To complete your registration and activate your account, please verify your email address by clicking the button below.",
            action: {
                button: {
                    text: "Verify your Email",
                    link: verificationUrl,
                    color: "#22BC66",
                },
            },
            outro: [
                `Please note that this link will expire in ${expiresIn} minutes. If the link has expired, you can request a new verification email by visiting our website.`,
                `If you didn’t create an account with us, you can safely ignore this email.`,
            ],
        },
    };
}

/**
 * Generates the email content template for password reset
 *
 * @export
 * @param {{ username: string; passwordResetUrl: string }} options
 * @returns {Mailgen.Content}
 */
export function passwordResetTemplate({ username, passwordResetUrl }) {
    const expiresIn = env.VERIFICATION_TOKEN_EXPIRY / 60000;

    return {
        body: {
            name: username,
            intro: "We received a request to reset your password for your MarketSpace account. Click the button below to reset your password",
            action: {
                button: {
                    text: "Reset your password",
                    link: passwordResetUrl,
                    color: "#22BC66",
                },
            },
            outro: `For security reasons, this link will expire in ${expiresIn} minutes.`,
        },
    };
}

/**
 * Generates the email content template for when a user creates a new store
 *
 * @export
 * @param {{ username: string; storeName: string; connectStripeAccountUrl: string }} options
 * @returns {Mailgen.Content}
 */
export function completeStoreSetupTemplate({
    username,
    storeName,
    connectStripeAccountUrl,
}) {
    return {
        body: {
            name: username,
            intro: [
                `Congratulations on creating your store, ${storeName}!`,
                "To activate your store and start accepting payments from your customers, you'll need to connect your store to a Stripe account. Without this connection, you won’t be able to process transactions.",
                "Click the button below to connect your Stripe account",
            ],
            action: {
                button: {
                    text: "Connect Stripe Account",
                    link: connectStripeAccountUrl,
                    color: "#22BC66",
                },
            },
            outro: [
                "If you have any questions or need assistance, feel free to reach out to us",
                "Happy selling!",
            ],
        },
    };
}
