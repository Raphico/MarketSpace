import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user/get-user-profile.controller.js";
import { updateUserProfile } from "../controllers/user/update-user-profile.controller.js";

const router = Router();

router.get("/me", verifyJWT, getUserProfile);
router.patch("/update", verifyJWT, updateUserProfile);

export default router;
