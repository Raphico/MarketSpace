import {
    generateAccessToken,
    generateRefreshToken,
} from "../../services/token.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { env } from "../../config.js";

export const googleLogin = asyncHandler(
    async function googleLogin(request, response) {
        const { user } = request;

        const accessToken = generateAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
        });

        response
            .status(301)
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.NODE_ENV === "production",
            })
            .redirect(
                `${env.CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}`
            );
    }
);
