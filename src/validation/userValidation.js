import Joi from "joi";

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  accessRole: Joi.string().required().valid('ADMIN', 'SUPER_ADMIN')
});

const userUpdateSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  accessRole: Joi.string().optional().valid('ADMIN', 'SUPER_ADMIN')
});

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const userByIdSchema = Joi.object({
  id: Joi.number().required()
});

export {
  userCreateSchema,
  userUpdateSchema,
  userLoginSchema,
  userByIdSchema
}