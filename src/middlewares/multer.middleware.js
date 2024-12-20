import multer from "multer";
import { ApiError } from "../utils/api-error.js";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5242880,
        files: 2,
    },
    fileFilter: (request, file, next) => {
        if (!file.mimetype.startsWith("image/")) {
            next(null, false);
            return next(
                new ApiError({
                    message: `'${file.fieldname}' must be an image file`,
                    statusCode: 400,
                })
            );
        }
        next(null, true);
    },
});
