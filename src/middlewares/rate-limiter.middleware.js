import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/api-error.js";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (request) => request.clientIp, // for accurate client IP detection
    handler: (_, __, ___, options) => {
        throw new ApiError({
            message: `Too many requests. Please try again after ${Math.ceil(options.windowMs / 60000)} minutes`,
            statusCode: options.statusCode,
        });
    },
});

export const mailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (request) => request.clientIp,
    handler: (_, __, ___, options) => {
        throw new ApiError({
            message: `Too many requests. Please try again after an hour`,
            statusCode: options.statusCode,
        });
    },
});
