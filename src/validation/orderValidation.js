import Joi from "joi";

const orderCreateSchema = Joi.object({
  customerName: Joi.string().required(),
  address: Joi.string().required(),
  serviceId: Joi.number().required(),
  date: Joi.date().required(),
  status: Joi.string().optional(),
  totalPrice: Joi.number().required(),
  picId: Joi.number().required(),
});

const orderUpdateSchema = Joi.object({
  id: Joi.number().required(),
  customerName: Joi.string().optional(),
  address: Joi.string().optional(),
  serviceId: Joi.number().optional(),
  date: Joi.date().required(),
  totalPrice: Joi.number().optional(),
  picId: Joi.number().optional(),
  status: Joi.string().optional().valid('BELUM','SEDANG_DIKERJAKAN','SELESAI')
});

const orderByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const orderDataSchema = Joi.object({
  search: Joi.string().optional().allow(''),
});

export {
  orderCreateSchema,
  orderByIdSchema,
  orderUpdateSchema,
  orderDataSchema
}