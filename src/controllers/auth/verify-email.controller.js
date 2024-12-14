import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const verifyEmail = asyncHandler(
    async function verifyEmail(request, response) {
        const { verificationToken } = request.params;

        if (!verificationToken) {
            throw new ApiError({
                message: "email verification token not found",
                statusCode: 400,
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const user = await db.query.users.findFirst({
            columns: {
                id: true,
                emailVerificationExpiry: true,
            },
            where: and(eq(hashedToken, users.emailVerificationToken)),
        });

        if (!user) {
            throw new ApiError({
                message: "invalid email verification token",
                statusCode: 400,
            });
        }

        if (Date.now() > user.emailVerificationExpiry.getTime()) {
            throw new ApiError({
                message: "email verification token has expired",
                statusCode: 400,
            });
        }

        await db
            .update(users)
            .set({
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiry: null,
            })
            .where(and(eq(hashedToken, users.emailVerificationToken)));

        response.status(200).json(
            new ApiResponse({
                data: {
                    isEmailVerified: true,
                },
                message: "Email verified successfully",
                status: "ok",
            })
        );
    }
);
