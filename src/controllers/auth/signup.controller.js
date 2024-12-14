import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import {
    emailVerificationTemplate,
    sendEmail,
} from "../../services/mail.service.js";
import { generateVerificationToken } from "../../services/token.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { signUpSchema } from "../../validators/auth.validator.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const signup = asyncHandler(async function signup(request, response) {
    const { username, email, password } = request.body;

    const { error } = signUpSchema.validate({
        email,
        password,
        username,
    });

    if (error) {
        throw new ApiError({
            message: error,
            statusCode: 400,
        });
    }

    const userExists = await db.query.users.findFirst({
        columns: {
            id: true,
        },
        where: or(eq(email, users.email), eq(username, users.username)),
    });

    if (userExists) {
        throw new ApiError({
            message: "user with email or username already exists",
            statusCode: 409,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { unHashedToken, hashedToken, expiresAt } =
        generateVerificationToken();

    const user = await db
        .insert(users)
        .values({
            username,
            email,
            password: hashedPassword,
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: expiresAt,
        })
        .returning({
            id: users.id,
            username: users.username,
            email: users.email,
        });

    await sendEmail({
        email,
        emailContent: emailVerificationTemplate({
            username,
            verificationUrl: `${request.protocol}://${request.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
        }),
        subject: "MarketSpace email verification",
    });

    response.status(201).json(
        new ApiResponse({
            data: user,
            status: "ok",
            message:
                "signup successful. A verification email has been sent to your email",
        })
    );
});
