import stream from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import { uploadFile } from "../../services/cloudinary.service.js";

export async function uploadStoreImages(request, prevBannerUrl, prevLogoUrl) {
    let bannerUrl;
    if (request.files?.banner) {
        const readable = stream.Readable.from(request.files.banner[0].buffer);
        const uploadResult = await uploadFile(readable);

        if (prevBannerUrl) {
            await cloudinary.uploader.destroy(
                extractPublicIdFromUrl(prevBannerUrl)
            );
        }

        bannerUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: "auto",
            quality: "auto",
        });
    }

    let logoUrl;
    if (request.files?.logo) {
        const readable = stream.Readable.from(request.files.logo[0].buffer);
        const uploadResult = await uploadFile(readable);

        if (prevLogoUrl) {
            await cloudinary.uploader.destroy(
                extractPublicIdFromUrl(prevLogoUrl)
            );
        }

        logoUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: "auto",
            quality: "auto",
        });
    }

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
