import Joi from "joi";

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  accessRole: Joi.string().required().valid('ADMIN', 'SUPER_ADMIN')
});

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export {
  userCreateSchema,
  userLoginSchema
}