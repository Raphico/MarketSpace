import jwt from "jsonwebtoken";
import { redisClient } from "../../services/redis.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const logout = asyncHandler(async function logout(request, response) {
    const accessToken = request.headers.authorization.replace("Bearer ", "");
    const tokenExpiry = request.user.exp * 1000;
    const ttl = tokenExpiry - Date.now();

    if (ttl > 0) {
        await redisClient.set(`accessToken:${accessToken}`, "blacklisted", {
            PX: ttl,
        });
    }

    await redisClient.del(`user:${request.user.id}:refreshToken`);

    response
        .status(200)
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .json(
            new ApiResponse({
                data: null,
                message: "logout successful",
                status: "ok",
            })
        );
});
