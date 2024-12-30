import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { stores } from "../../db/schema.js";

export const getStoreById = asyncHandler(
    async function getStore(request, response) {
        const { id } = request.params;

        const store = await db.query.stores.findFirst({
            where: eq(stores.id, id),
            columns: {
                stripeAccountId: false,
            },
        });

        if (!store) {
            throw new ApiError({
                message: "store not found",
                statusCode: 404,
            });
        }

        response.status(200).json(
            new ApiResponse({
                data: store,
                message: "store retrieved successfully",
                status: "ok",
            })
        );
    }
);
