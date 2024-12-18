import { logger } from "../loggers/winston.logger.js";

process.on("uncaughtException", (error, origin) => {
    logger.error(`uncaughtException: ${error.message}`, {
        error,
        origin,
    });
    process.exitCode = 1;
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(`unhandledRejection: ${reason}`, {
        promise,
        reason,
    });
    process.exitCode = 1;
});
