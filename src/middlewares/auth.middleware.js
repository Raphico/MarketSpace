import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { redisClient } from "../services/redis.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const verifyJWT = asyncHandler(
    async function verifyJWT(request, response, next) {
        if (
            !request.headers.authorization ||
            !request.headers.authorization.startsWith("Bearer ")
        ) {
            throw new ApiError({
                message: "unauthorized",
                statusCode: 401,
            });
        }

        const token = request.headers.authorization.replace("Bearer ", "");

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            throw new ApiError({
                statusCode: 401,
                message: "unauthorized",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await db.query.users.findFirst({
                columns: {
                    id: true,
                },
                where: eq(users.id, decoded.id),
            });
            if (!user) {
                throw new ApiError({
                    message: "user not found",
                    statusCode: 401,
                });
            }

            request.user = decoded;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new ApiError({
                    statusCode: 401,
                    message: "access token has expired",
                });
            }

            if (error.name === "JsonWebTokenError") {
                throw new ApiError({
                    statusCode: 401,
                    message: "invalid access token",
                });
            }

            throw error;
        }
    }
);
