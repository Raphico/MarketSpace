import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../services/token.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { loginSchema } from "../../validators/auth.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const login = asyncHandler(async function login(request, response) {
    const { email, password } = request.body;

    const { error } = loginSchema.validate({
        email,
        password,
    });

    if (error) {
        throw new ApiError({
            message: error,
            statusCode: 400,
        });
    }

    const user = await db.query.users.findFirst({
        where: eq(email, users.email),
    });
    if (!user) {
        throw new ApiError({
            message: "user not found",
            statusCode: 400,
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new ApiError({
            message: "password doesn't match",
            statusCode: 400,
        });
    }

    if (!user.isEmailVerified) {
        throw new ApiError({
            message: "email is unverified",
            statusCode: 403,
        });
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    });
    const refreshToken = generateRefreshToken({
        id: user.id,
    });

    response
        .status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json(
            new ApiResponse({
                data: {
                    id: user.id,
                    username: user.email,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    role: user.role,
                    token: accessToken,
                },
                status: "ok",
                message: "login successful",
            })
        );
});