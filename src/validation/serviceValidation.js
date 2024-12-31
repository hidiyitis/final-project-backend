import Joi from "joi";

const serviceCreateSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  desc: Joi.string().required()
});

const serviceUpdateSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().optional(),
  price: Joi.number().optional(),
  desc: Joi.string().optional(),
  status: Joi.string().valid("AVAILABLE", "NON_AVAILABLE").optional(),
});

export {
  serviceCreateSchema,
  serviceUpdateSchema,
}