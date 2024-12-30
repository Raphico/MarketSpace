import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import requestIp from "request-ip";
import { errorHandler } from "./middlewares/error.middleware.js";
import { limiter } from "./middlewares/rate-limiter.middleware.js";
import authRoute from "./routes/auth.route.js";
import healthRoute from "./routes/health.route.js";
import storeRoute from "./routes/store.route.js";
import userRoute from "./routes/user.route.js";
import { morganMiddleware } from "./loggers/morgan.logger.js";

export const app = express();

app.use(helmet());

app.use(morganMiddleware);
app.use(cors());

app.use(requestIp.mw());
app.use(limiter);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(passport.initialize());

app.use("/api/v1/health", healthRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/stores", storeRoute);

app.use(errorHandler);
