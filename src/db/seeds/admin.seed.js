import bcrypt from "bcrypt";
import { signUpSchema } from "../../validators/auth.validator.js";
import { env } from "../../config.js";
import { db } from "../index.js";
import { users } from "../schema.js";

export async function seedAdmin() {
    const { value, error } = signUpSchema.validate({
        username: env.ADMIN_USERNAME,
        password: env.ADMIN_PASSWORD,
        email: env.ADMIN_EMAIL,
    });

    if (error) {
        throw new Error(error);
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    console.log(`📝 Inserting admin`);
    await db
        .insert(users)
        .values({
            username: value.username,
            password: hashedPassword,
            email: value.email,
            role: "admin",
        })
        .onConflictDoNothing();
}
