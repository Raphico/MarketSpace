import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { updateStoreSchema } from "../../validators/store.validator.js";
import { db } from "../../db/index.js";
import { categories, stores } from "../../db/schema.js";
import { uploadStoreImages } from "./utils.js";

export const updateStore = asyncHandler(
    async function updateStore(request, response) {
        const { id } = request.params;

        const store = await db.query.stores.findFirst({
            column: {
                userId: true,
                id: true,
                banner: true,
                logo: true,
            },
            where: eq(stores.id, id),
        });

        if (!store) {
            throw new ApiError({
                message: "store does not exists",
                statusCode: 404,
            });
        }

        if (store.userId !== request.user.id) {
            throw new ApiError({
                message: "You are not allowed to update this store",
                statusCode: 403,
            });
        }

        const { error, value } = updateStoreSchema.validate(request.body);
        if (error) {
            throw new ApiError({
                message: error,
                statusCode: 400,
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

        const { logoUrl, bannerUrl } = await uploadStoreImages(
            request,
            store.banner,
            store.logo
        );

        if (!logoUrl && !bannerUrl && !Object.keys(value).length === 0) {
            throw new ApiError({
                message: "No data provided to update",
                statusCode: 400,
            });
        }

        await db.update(stores).set({
            categoryId: value.categoryId ?? stores.categoryId,
            description: value.description ?? stores.description,
            name: value.name ?? stores.name,
            logo: logoUrl ?? stores.logo,
            banner: bannerUrl ?? stores.banner,
        });

        response.status(200).json(
            new ApiResponse({
                data: {
                    ...value,
                    ...(logoUrl ? { logo: logoUrl } : {}),
                    ...(bannerUrl ? { banner: bannerUrl } : {}),
                },
                status: "ok",
                message: "store updated successfully",
            })
        );
    }
);
