/**
 * @description
 * This object defines the available authentication methods (or "strategies") that a user can use to log in or register in the application.
 * It maps each method to a constant string for consistency and type safety across the codebase.
 *
 * @type {{ GOOGLE: "google"; EMAIL_PASSWORD: "email_password"} as const}
 */
export const STRATEGY = Object.freeze({
    GOOGLE: "google",
    EMAIL_PASSWORD: "email_password",
});

export const VERIFICATION_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
