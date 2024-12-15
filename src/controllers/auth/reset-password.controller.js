import crypto from "crypto";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { passwordSchema } from "../../validators/auth.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const resetPassword = asyncHandler(
    async function resetPassword(request, response) {
        const { resetToken } = request.params;
        const { newPassword } = request.body;

        const { error } = passwordSchema.validate(newPassword);

        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user = await db.query.users.findFirst({
            columns: {
                passwordResetExpiry: true,
            },
            where: eq(users.passwordResetToken, hashedToken),
        });

        if (!user) {
            throw new ApiError({
                message: "invalid reset token",
                statusCode: 400,
            });
        }

        if (Date.now() > new Date(user.passwordResetExpiry).getTime()) {
            throw new ApiError({
                message: "reset token has expired",
                statusCode: 400,
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db
            .update(users)
            .set({
                password: hashedPassword,
                passwordResetExpiry: null,
                passwordResetToken: null,
            })
            .where(eq(users.passwordResetToken, hashedToken));

        response.status(200).json(
            new ApiResponse({
                data: null,
                message: "password reset was successful",
                status: "ok",
            })
        );
    }
);
