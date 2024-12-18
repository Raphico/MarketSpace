import { eq } from "drizzle-orm";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ApiError } from "../utils/api-error.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { STRATEGY } from "../constants.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function verify(_, __, profile, next) {
            const user = await db.query.users.findFirst({
                column: {
                    id: true,
                    strategy: true,
                },
                where: eq(users.email, profile._json.email),
            });

            if (user && user.strategy != STRATEGY.GOOGLE) {
                const loginType = user.strategy.split("_").join(" and ");
                return next(
                    new ApiError({
                        message: `You have previously registered using ${loginType}. Please use the ${loginType} login option to access your account`,
                        statusCode: 409,
                    }),
                    null
                );
            }

            if (user && user.strategy == STRATEGY.GOOGLE) {
                return next(null, user);
            }

            const newUser = await db.insert(users).values({
                email: profile._json.email,
                strategy: "google",
                isEmailVerified: profile._json.email_verified,
                image: profile._json?.picture,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                username: profile._json.email.split("@")[0],
            });
            return next(null, newUser);
        }
    )
);
