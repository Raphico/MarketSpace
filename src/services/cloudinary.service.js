import { v2 as cloudinary } from "cloudinary";
import { env } from "../config.js";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(stream) {
    const uploadResult = await new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            (error, uploadResult) => {
                return resolve(uploadResult);
            }
        );

        stream.pipe(uploadStream);
    });

    return uploadResult;
}
