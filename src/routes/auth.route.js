import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mailLimiter } from "../middlewares/rate-limiter.middleware.js";
import { login } from "../controllers/auth/login.controller.js";
import { logout } from "../controllers/auth/logout.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh-access-token.controller.js";
import { requestResetPassword } from "../controllers/auth/request-reset-password.controller.js";
import { resendEmailVerification } from "../controllers/auth/resend-email-verification.controller.js";
import { resetPassword } from "../controllers/auth/reset-password.controller.js";
import { signup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/verify-email.controller.js";
import "../services/passport.service.js";
import passport from "passport";
import { googleLogin } from "../controllers/auth/google-login.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/request-reset-password", mailLimiter, requestResetPassword);
router.post("/reset-password/:resetToken", resetPassword);

router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/resend-email-verification", mailLimiter, resendEmailVerification);

router.get("/refresh-token", refreshAccessToken);

router.get("/logout", verifyJWT, logout);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
    }),
    googleLogin
);

export default router;
