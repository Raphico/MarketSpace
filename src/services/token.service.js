import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config.js";

/**@description generates temporary tokens for email verification, password reset etc. */
export function generateVerificationToken() {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + env.VERIFICATION_TOKEN_EXPIRY);

    return { unHashedToken, hashedToken, expiresAt };
}

export function generateAccessToken(data) {
    return jwt.sign(data, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
    });
}

export function generateRefreshToken(data) {
    return jwt.sign(data, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRY,
    });
}
