import crypto from "crypto";
import jwt from "jsonwebtoken";
import { VERIFICATION_TOKEN_EXPIRY } from "../constants.js";

/**@description generates temporary tokens for email verification, password reset etc. */
export function generateVerificationToken() {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    return { unHashedToken, hashedToken, expiresAt };
}

export function generateAccessToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
}

export function generateRefreshToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
}
