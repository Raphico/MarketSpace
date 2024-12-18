import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { updateUserProfileSchema } from "../../validators/user.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const updateUserProfile = asyncHandler(
    async function updateUserProfile(request, response) {
        const { error, value } = updateUserProfileSchema.validate(request.body);

        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        try {
            await db
                .update(users)
                .set({
                    username: value.username ?? users.username,
                    firstName: value.lastName ?? users.firstName,
                    lastName: value.firstName ?? users.lastName,
                })
                .where(eq(users.id, request.user.id));
        } catch (error) {
            if (error.code == "23505") {
                throw new ApiError({
                    message: `username '${value.username}' already in use`,
                    statusCode: 400,
                });
            }

            throw error;
        }

        response.status(202).json(
            new ApiResponse({
                data: value,
                message: "profile update successful",
                status: "ok",
            })
        );
    }
);
