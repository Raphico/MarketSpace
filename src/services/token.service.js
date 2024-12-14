import crypto from "crypto";
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
