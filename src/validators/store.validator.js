import Joi from "joi";

export const storeSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10),
    categoryId: Joi.string(),
});

export const updateStoreSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().min(10),
    categoryId: Joi.string(),
});
