import { userCreateSchema, userLoginSchema, userByIdSchema, userUpdateSchema } from "../validation/userValidation.js";
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

const getUsers = async (req, res)=>{
  const postRequest = async()=>{
    return userService.getUsers();
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed get user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success get user', httpCode.OK);
  };
  sendResponse(await postRequest());
}

const getUserById = async (req, res)=>{
  const payload = {id: req.params.id}
  const checkValidation = validateSchema(userByIdSchema, payload);
  const postRequest = async(result)=>{
    if (result.err){
      return result
    }
    return userService.getUserById(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed get user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success get user', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

const updateUser = async (req, res)=>{
  const payload = {
    id: req.params.id,
    ...req.body
  };
  const checkValidation = validateSchema(userUpdateSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return userService.updateUser(result);
  };
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed update user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success update user', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

const deleteUser = async (req, res)=>{
  const payload = req.params.id;
  
  const postRequest = async(result)=>{
    return userService.deleteUser(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed delete user', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success delete user', httpCode.OK);
  };
  sendResponse(await postRequest(payload));
}

export default {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}