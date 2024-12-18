import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { redisClient } from "../../services/redis.service.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../services/token.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const refreshAccessToken = asyncHandler(
    async function refreshAccessToken(request, response) {
        const incomingRefreshToken = request.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError({
                message: "unauthorized",
                statusCode: 401,
            });
        }

        try {
            const decoded = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            const user = await db.query.users.findFirst({
                columns: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                },
                where: eq(users.id, decoded.id),
            });

            if (!user) {
                throw new ApiError({
                    message: "user not found",
                    statusCode: 401,
                });
            }

            const match = await redisClient.get(`user:${user.id}:refreshToken`);
            if (!match) {
                throw new ApiError({
                    message: "token invalid",
                    statusCode: 401,
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

            await redisClient.set(
                `user:${user.id}:refreshTokens`,
                refreshToken
            );

            response
                .status(200)
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                })
                .json(
                    new ApiResponse({
                        data: { token: accessToken },
                        message: "refresh successful",
                        status: "ok",
                    })
                );
        } catch (error) {
            if (
                error.name === "TokenExpiredError" ||
                error.name === "JsonWebTokenError"
            ) {
                throw new ApiError({
                    statusCode: 401,
                    message: "token invalid",
                });
            }

            throw error;
        }
    }
);
