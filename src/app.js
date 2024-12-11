import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthRoute from "./routes/health.route.js";
import { morganMiddleware } from "./loggers/morgan.logger.js";

export const app = express();

app.use(morganMiddleware);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/health", healthRoute);

app.use(errorHandler);
