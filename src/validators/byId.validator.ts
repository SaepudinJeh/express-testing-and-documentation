import * as Joi from "joi"

export const byIdValidator = Joi.object({
  _id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
