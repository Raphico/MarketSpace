import stream from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import { uploadFile } from "../../services/cloudinary.service.js";

export async function uploadStoreImages(request, prevBannerUrl, prevLogoUrl) {
    const uploadTasks = [];

    if (request.files?.banner) {
        const readable = stream.Readable.from(request.files.banner[0].buffer);
        const bannerUploadTask = uploadFile(readable).then(
            async (uploadResult) => {
                if (prevBannerUrl) {
                    await cloudinary.uploader.destroy(
                        extractPublicIdFromUrl(prevBannerUrl)
                    );
                }
                return cloudinary.url(uploadResult.public_id, {
                    fetch_format: "auto",
                    quality: "auto",
                });
            }
        );
        uploadTasks.push(bannerUploadTask);
    }

    if (request.files?.logo) {
        const readable = stream.Readable.from(request.files.logo[0].buffer);
        const logoUploadTask = uploadFile(readable).then(
            async (uploadResult) => {
                if (prevLogoUrl) {
                    await cloudinary.uploader.destroy(
                        extractPublicIdFromUrl(prevLogoUrl)
                    );
                }
                return cloudinary.url(uploadResult.public_id, {
                    fetch_format: "auto",
                    quality: "auto",
                });
            }
        );
        uploadTasks.push(logoUploadTask);
    }

    const [bannerUrl, logoUrl] = await Promise.all(uploadTasks);

    return {
        logoUrl,
        bannerUrl,
    };
}

function extractPublicIdFromUrl(fileUrl) {
    const parts = fileUrl.split("/");
    const publicIdWithExtension = parts[parts.length - 1];
    return publicIdWithExtension.split("?")[0];
}
