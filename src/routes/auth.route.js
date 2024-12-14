import { Router } from "express";
import { mailLimiter } from "../middlewares/rate-limiter.middleware.js";
import { login } from "../controllers/auth/login.controller.js";
import { resendEmailVerification } from "../controllers/auth/resend-email-verification.controller.js";
import { signup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/verify-email.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/resend-email-verification", mailLimiter, resendEmailVerification);

export default router;
