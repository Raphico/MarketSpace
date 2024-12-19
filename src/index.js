import "dotenv/config";
import { logger } from "./loggers/winston.logger.js";
import { app } from "./app.js";
import "./utils/uncaught-errors.js";
import { env } from "./config.js";

app.listen(env.PORT, () =>
    logger.info(`Server is running on port ${env.PORT}`)
);
