import * as Joi from "joi";

export const postValidator = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
});
