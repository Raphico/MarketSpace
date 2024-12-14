import { eq } from "drizzle-orm";
import {
    emailVerificationTemplate,
    sendEmail,
} from "../../services/mail.service.js";
import { generateVerificationToken } from "../../services/token.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { emailSchema } from "../../validators/auth.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

/**
 * This controller handles the process of resending an email verification link to users who
 * may not have received it initially. It is designed to be called when a user has failed to
 * verify their email after registration.
 */
export const resendEmailVerification = asyncHandler(
    async function resendEmailVerification(request, response) {
        const { email } = request.body;

        const { error } = emailSchema.validate({
            email,
        });

        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        const user = await db.query.users.findFirst({
            column: {
                id: true,
                username: true,
                isEmailVerified: true,
            },
            where: eq(users.email, email),
        });

        if (!user) {
            throw new ApiError({
                message: "user not found",
                statusCode: 400,
            });
        }

        if (user.isEmailVerified) {
            throw new ApiError({
                message: "email is already verified",
                statusCode: 409,
            });
        }

        const { unHashedToken, hashedToken, expiresAt } =
            generateVerificationToken();

        await db
            .update(users)
            .set({
                emailVerificationToken: hashedToken,
                emailVerificationExpiry: expiresAt,
            })
            .where(eq(users.email, email));

        await sendEmail({
            email,
            subject: "MarketSpace Email verification",
            emailContent: emailVerificationTemplate({
                username: user.username,
                verificationUrl: `${request.protocol}://${request.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
            }),
        });

        response.status(202).json(
            new ApiResponse({
                data: null,
                status: "ok",
                message: "a verification email has been sent",
            })
        );
    }
);
