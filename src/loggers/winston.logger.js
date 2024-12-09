import winston from "winston";

const colors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    verbose: "cyan",
    debug: "green",
    silly: "gray",
};

winston.addColors(colors);

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
            (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "development" ? "silly" : "warn",
            format: winston.format.colorize({ all: true }),
        }),
        new winston.transports.File({
            level: "error",
            filename: "logs/error.log",
        }),
        new winston.transports.File({
            level: "http",
            filename: "logs/combined.log",
        }),
    ],
});
