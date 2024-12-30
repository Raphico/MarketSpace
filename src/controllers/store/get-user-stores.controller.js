import { eq } from "drizzle-orm";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { db } from "../../db/index.js";
import { stores } from "../../db/schema.js";

export const getUserStores = asyncHandler(
    async function getUserStores(request, response) {
        const userStores = await db.query.stores.findMany({
            columns: {
                stripeAccountId: false,
            },
            where: eq(request.user.id, stores.userId),
        });

        response.status(200).json(
            new ApiResponse({
                data: userStores,
                status: "ok",
                message: "successfully retrieved user's stores",
            })
        );
    }
);
