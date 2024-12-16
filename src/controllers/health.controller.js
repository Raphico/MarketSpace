import { sql } from "drizzle-orm";
import { redisClient } from "../services/redis.service.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../db/index.js";
import { logger } from "../loggers/winston.logger.js";

export const healthCheck = asyncHandler(
    async function healthCheck(request, response) {
        let isDbConnected;
        let isRedisConnected;

        try {
            isDbConnected = await db.execute(sql`SELECT NOW()`);
        } catch (error) {
            logger.error("Database connection error:", error);
            isDbConnected = null;
        }

        try {
            isRedisConnected = (await redisClient.ping()) === "PONG";
        } catch (error) {
            logger.error("Redis connection error:", error);
            isRedisConnected = false;
        }

        const status =
            isDbConnected && isRedisConnected ? "healthy" : "unhealthy";

        const statusCode = status === "healthy" ? 200 : 503;

        const message =
            status === "healthy"
                ? "Service is running smoothly"
                : "One or more dependencies are failing";

        response.status(statusCode).json(
            new ApiResponse({
                data: {
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    dependencies: {
                        database: isDbConnected ? "connected" : "disconnected",
                        redis: isRedisConnected ? "connected" : "disconnected",
                    },
                },
                status,
                message,
            })
        );
    }
);
