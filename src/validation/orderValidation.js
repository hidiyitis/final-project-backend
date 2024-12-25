import Joi from "joi";

const orderCreateSchema = Joi.object({
  title: Joi.string().required(),
  address: Joi.string().required(),
  service: Joi.string().required(),
  date: Joi.date().required(),
  price: Joi.number().required(),
  picId: Joi.number().required(),
});

const orderUpdateSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().optional(),
  address: Joi.string().optional(),
  service: Joi.string().optional(),
  picId: Joi.number().optional(),
  status: Joi.string().optional().valid('BELUM','SEDANG_DIKERJAKAN','SELESAI')
});

const orderByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const orderDataSchema = Joi.object({
  search: Joi.string().optional(),
});

export {
  orderCreateSchema,
  orderByIdSchema,
  orderUpdateSchema,
  orderDataSchema
}