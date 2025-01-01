import Joi from "joi";

const serviceCreateSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  desc: Joi.string().required()
});

const serviceUpdateSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  desc: Joi.string().required(),
  status: Joi.string().valid("AVAILABLE", "NON_AVAILABLE").required(),
});

export {
  serviceCreateSchema,
  serviceUpdateSchema,
}