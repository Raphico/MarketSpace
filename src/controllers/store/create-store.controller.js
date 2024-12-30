import { eq } from "drizzle-orm";
import {
    completeStoreSetupTemplate,
    sendEmail,
} from "../../services/mail.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { storeSchema } from "../../validators/store.validator.js";
import { db } from "../../db/index.js";
import { categories, stores, users } from "../../db/schema.js";
import { uploadStoreImages } from "./utils.js";

export const createStore = asyncHandler(
    async function createStore(request, response) {
        const { error, value } = storeSchema.validate(request.body);

        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
            });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, request.user.id),
        });

        if (!user.firstName || !user.lastName) {
            throw new ApiError({
                message:
                    "Please complete your profile. First name or last name not provided",
                statusCode: 403,
            });
        }

        if (value.categoryId) {
            const categoryExists = await db.query.categories.findFirst({
                where: eq(categories.id, value.categoryId),
            });

            if (!categoryExists) {
                throw new ApiError({
                    message: "category doesn't exists",
                    statusCode: 400,
                });
            }
        }

        const { logoUrl, bannerUrl } = await uploadStoreImages(request);

        const store = await db
            .insert(stores)
            .values({
                name: value.name,
                categoryId: value.categoryId,
                description: value.description,
                userId: user.id,
                logo: logoUrl,
                banner: bannerUrl,
            })
            .returning();

        await sendEmail({
            email: user.email,
            subject: "Action Required: Complete Your Store Setup",
            emailContent: completeStoreSetupTemplate({
                username: user.username,
                storeName: value.name,
                connectStripeAccountUrl: `${request.protocol}://${request.get("host")}/api/v1/store/stripe`,
            }),
        });

        response.status(200).json(
            new ApiResponse({
                data: store,
                message: "store created successfully",
                status: "ok",
            })
        );
    }
);
