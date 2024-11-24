import httpCode from "../constant/httpCode.js"
import { BadRequest, Forbidden, NotFound, Unauthorized } from "../errors/index.js"

const error = (error)=>{return {err: error, message: error.message}}

const data = (data, message)=>{return { err: null, data, message}}

const response = (res, type, result, message = '', code = 200)=>{
  let status = true;
  let data = result.data;
  if (type == 'fail') {
    status = false,
    data
    message = result.message || message
    code = checkCode(result.err) || code
  }

  res.status(code).send({
    status,
    data,
    message,
    code
  })
}

const checkCode = (error)=>{
  switch (error.constructor) {
    case BadRequest:
      return httpCode.BAD_REQUEST
    case Unauthorized:
      return httpCode.UNAUTHORIZED
    case Forbidden:
      return httpCode.FORBIDDEN
    case NotFound:
      return httpCode.NOT_FOUND
    default:
      return httpCode.INTERNAL_SERVER
  }
}

export default {
  error,
  data,
  response
}