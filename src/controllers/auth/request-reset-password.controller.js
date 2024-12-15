import { eq } from "drizzle-orm";
import {
    passwordResetTemplate,
    sendEmail,
} from "../../services/mail.service.js";
import { generateVerificationToken } from "../../services/token.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { emailSchema } from "../../validators/auth.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const requestResetPassword = asyncHandler(
    async function requestResetPassword(request, response) {
        const { email } = request.body;

        const { error } = emailSchema.validate(email);

        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        const user = await db.query.users.findFirst({
            columns: {
                id: true,
                username: true,
            },
            where: eq(email, users.email),
        });

        if (!user) {
            throw new ApiError({
                message: "user not found",
                statusCode: 400,
            });
        }

        const { unHashedToken, hashedToken, expiresAt } =
            generateVerificationToken();

        await db
            .update(users)
            .set({
                passwordResetToken: hashedToken,
                passwordResetExpiry: expiresAt,
            })
            .where(eq(users.email, email));

        await sendEmail({
            email,
            subject: "Reset your password",
            emailContent: passwordResetTemplate({
                username: user.username,
                // Frontend will send the below token with the new password in the request body to the backend reset password endpoint
                passwordResetUrl: `${process.env.CLIENT_URL}/reset-password/${unHashedToken}`,
            }),
        });

        response.status(202).json(
            new ApiResponse({
                data: null,
                message: "password reset link has been sent to your email",
                status: "ok",
            })
        );
    }
);
