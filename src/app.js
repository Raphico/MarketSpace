import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import { morganMiddleware } from "./loggers/morgan.logger.js";

export const app = express();

app.use(morganMiddleware);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);
