import express from "express";
import cors from "cors";
import { morganMiddleware } from "./loggers/morgan.logger.js";

export const app = express();

app.use(morganMiddleware);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
