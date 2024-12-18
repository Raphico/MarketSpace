import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changePassword } from "../controllers/user/change-password.controller.js";
import { getUserProfile } from "../controllers/user/get-user-profile.controller.js";
import { updateUserProfile } from "../controllers/user/update-user-profile.controller.js";

const router = Router();

router.get("/me", verifyJWT, getUserProfile);
router.patch("/update", verifyJWT, updateUserProfile);
router.patch("/change-password", verifyJWT, changePassword);

export default router;
