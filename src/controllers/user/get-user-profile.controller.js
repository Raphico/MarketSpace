import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const getUserProfile = asyncHandler(
    async function getCurrentUser(request, response) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, request.user.id),
            columns: {
                password: false,
                stripeCustomerId: false,
                emailVerificationToken: false,
                emailVerificationExpiry: false,
                passwordResetExpiry: false,
                passwordResetToken: false,
            },
        });

        if (!user) {
            throw new ApiError({
                message: "user not found",
                statusCode: 404,
            });
        }

        response.status(200).json(
            new ApiResponse({
                data: user,
                message: "user profile retrieved successfully",
                status: "ok",
            })
        );
    }
);
