import { sql } from "drizzle-orm";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../db/index.js";
import { logger } from "../loggers/winston.logger.js";

export const healthCheck = asyncHandler(
    async function healthCheck(request, response) {
        let isDbConnected;
        try {
            isDbConnected = await db.execute(sql`SELECT NOW()`);
        } catch (error) {
            logger.error(error);
            isDbConnected = null;
        }

        const status = isDbConnected ? "healthy" : "unhealthy";
        const message = isDbConnected
            ? "service is running smoothly"
            : "database issue detected";
        const statusCode = isDbConnected ? 200 : 503;

        response.status(statusCode).json(
            new ApiResponse({
                data: {
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    dependencies: {
                        database: isDbConnected ? "connected" : "disconnected",
                    },
                },
                status,
                message,
            })
        );
    }
);
