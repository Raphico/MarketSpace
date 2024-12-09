import express from "express";
import { morganMiddleware } from "./loggers/morgan.logger.js";

export const app = express();

app.use(morganMiddleware);
