import jwt from "jsonwebtoken";
import { redisClient } from "../../services/redis.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const logout = asyncHandler(async function logout(request, response) {
    const accessToken = request.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const tokenExpiry = decoded.exp * 1000;
    const ttl = tokenExpiry - Date.now();

    if (ttl > 0) {
        await redisClient.set(`accessToken:${accessToken}`, "blacklisted", {
            PX: ttl,
        });
    }

    await redisClient.del(`user:${decoded.id}:refreshToken`);

    response
        .status(200)
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json(
            new ApiResponse({
                data: null,
                message: "logout successful",
                status: "ok",
            })
        );
});
