import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { changePasswordSchema } from "../../validators/user.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const changePassword = asyncHandler(
    async function changePassword(request, response) {
        const { currentPassword, newPassword } = request.body;

        const { error } = changePasswordSchema.validate({
            currentPassword,
            newPassword,
        });
        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        const user = await db.query.users.findFirst({
            columns: {
                id: true,
                password: true,
            },
            where: eq(users.id, request.user.id),
        });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            throw new ApiError({
                message: "incorrect password",
                statusCode: 401,
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(eq(users.id, request.user.id));

        response.status(202).json(
            new ApiResponse({
                data: null,
                status: "ok",
                message: "password updated",
            })
        );
    }
);
