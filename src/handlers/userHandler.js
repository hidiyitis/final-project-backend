import { userCreateSchema, userLoginSchema } from "../validation/userValidation.js";
import { validateSchema } from "../utils/validator/validator.js";
import wrapper from "../utils/helpers/wrapper.js";
import userService from '../services/userService.js'
import httpCode from "../utils/constant/httpCode.js";

const createUser = async (req, res)=>{
  const payload = req.body;
  const checkValidation = validateSchema(userCreateSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return userService.createUser(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed create user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success create user', httpCode.CREATED);
  };
  sendResponse(await postRequest(checkValidation));
}

const loginUser = async (req, res)=>{
  const payload = req.body;
  const checkValidation = validateSchema(userLoginSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return userService.loginUser(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed login user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success login user', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

export default {
  createUser,
  loginUser
}