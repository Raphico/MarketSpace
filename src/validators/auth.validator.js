import Joi from "joi";

export const emailSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: ["com", "org", "net", "edu", "io", "gov", "co"],
        })
        .max(255)
        .required(),
});

export const signUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: ["com", "org", "net", "edu", "io", "gov", "co"],
        })
        .max(255)
        .required(),
    password: Joi.string().min(8).max(255).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: ["com", "org", "net", "edu", "io", "gov", "co"],
        })
        .max(255)
        .required(),
    password: Joi.string().min(8).max(255).required(),
});
