import { orderByIdSchema, orderCreateSchema, orderDataSchema, orderUpdateSchema } from "../validation/orderValidation.js";
import { validateSchema } from "../utils/validator/validator.js";
import wrapper from "../utils/helpers/wrapper.js";
import orderService from "../services/orderService.js";
import httpCode from "../utils/constant/httpCode.js";

const createOrder = async (req, res)=>{
  const payload = req.body;
  const checkValidation = validateSchema(orderCreateSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return orderService.createOrder(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed create order', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success create order', httpCode.CREATED);
  };
  sendResponse(await postRequest(checkValidation));
}

const findOrderById = async (req, res)=>{
  const payload = {id: req.params.id, ...req.body};
  const checkValidation = validateSchema(orderByIdSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return orderService.findOrderById(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed get order', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success get order', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

const updateOrder = async (req, res)=>{
  const payload = {id: req.params.id, ...req.body};
  const checkValidation = validateSchema(orderUpdateSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return orderService.updateOrder(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed update order', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success update order', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

const getOrders = async (req, res)=>{
  const payload = req.query;
  const checkValidation = validateSchema(orderDataSchema, payload);
  const postRequest = async(result)=>{
    if (result.err) {
      return result
    }
    return orderService.getOrders(result);
  }
  const sendResponse = async(result)=>{
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed get orders', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success get orders', httpCode.OK);
  };
  sendResponse(await postRequest(checkValidation));
}

export default {
  createOrder,
  findOrderById,
  updateOrder,
  getOrders
}