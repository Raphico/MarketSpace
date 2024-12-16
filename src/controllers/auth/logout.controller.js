import jwt from "jsonwebtoken";
import { redisClient } from "../../services/redis.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const logout = asyncHandler(async function logout(request, response) {
    const token = request.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenExpiry = decoded.exp * 1000;
    const ttl = tokenExpiry - Date.now();

    if (ttl > 0) {
        await redisClient.set(token, "blacklisted", {
            PX: ttl,
        });
    }

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
