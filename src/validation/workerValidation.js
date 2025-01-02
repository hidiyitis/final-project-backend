import Joi from "joi";

const workerCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  alamat: Joi.string().required()
});

export {
  workerCreateSchema,
}