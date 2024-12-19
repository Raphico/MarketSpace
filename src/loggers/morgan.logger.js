import morgan from "morgan";
import { logger } from "./winston.logger.js";
import { env } from "../config.js";

export const morganMiddleware = morgan(
    env.NODE_ENV === "production"
        ? ":remote-addr - :remote-user [:date[clf]] ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent'"
        : ":method :url :status :response-time ms - :res[content-length]",
    {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
    }
);
