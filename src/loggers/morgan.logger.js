import morgan from "morgan";
import { logger } from "./winston.logger.js";

export const morganMiddleware = morgan(
    process.env.NODE_ENV === "production"
        ? ":remote-addr - :remote-user [:date[clf]] ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent'"
        : ":method :url :status :response-time ms - :res[content-length]",
    {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
        skip: () => process.env.NODE_ENV !== "development",
    }
);
