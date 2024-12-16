import redis from "redis";
import { logger } from "../loggers/winston.logger.js";

export const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("connect", () => logger.info("Redis is running"));
redisClient.on("error", (error) => logger.error(error));
redisClient.on("reconnecting", () => logger.info("Redis is reconnecting"));

await redisClient.connect();