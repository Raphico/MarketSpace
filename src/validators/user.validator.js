import Joi from "joi";

export const updateUserProfileSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50),
    firstName: Joi.string()
        .regex(/^[a-zA-Z-'\s]+$/)
        .min(3)
        .max(50)
        .messages({
            "string.pattern.base":
                "first name must only contain alphabets, spaces, hyphens, or apostrophes",
        }),
    lastName: Joi.string()
        .regex(/^[a-zA-Z-'\s]+$/)
        .min(3)
        .max(50)
        .messages({
            "string.pattern.base":
                "last name must only contain alphabets, spaces, hyphens, or apostrophes",
        }),
})
    .min(1)
    .required()
    .messages({
        "object.min":
            "you must provide at least one of the following: username, firstName, or lastName",
    });
