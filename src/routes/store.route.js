import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createStore } from "../controllers/store/create-store.controller.js";
import { getUserStores } from "../controllers/store/get-user-stores.controller.js";
import { updateStore } from "../controllers/store/update-store.controller.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    upload.fields([
        { name: "banner", maxCount: 1 },
        { name: "logo", maxCount: 1 },
    ]),
    createStore
);

router.route("/me").get(verifyJWT, getUserStores);

router.route("/:id").patch(
    verifyJWT,
    upload.fields([
        { name: "banner", maxCount: 1 },
        { name: "logo", maxCount: 1 },
    ]),
    updateStore
);

export default router;
