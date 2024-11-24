import Joi from "joi";

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  photoUrl: Joi.string().required()
});

export {
  userCreateSchema,
}