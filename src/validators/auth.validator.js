import Joi from "joi";

export const emailSchema = Joi.string()
    .label("email")
    .email({
        minDomainSegments: 2,
        tlds: ["com", "org", "net", "edu", "io", "gov", "co"],
    })
    .max(255)
    .required();

export const passwordSchema = Joi.string()
    .label("password")
    .min(8)
    .max(255)
    .required();

export const signUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: emailSchema,
    password: Joi.string().min(8).max(255).required(),
});

export const loginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
});
