import { prismaClient } from "../../config/database.js";
import httpCode from "../constant/httpCode.js"
import { InternalServer } from "../errors/InternalServer.js";
import { Unauthorized } from "../errors/Unauthorized.js"
import jwt from "jsonwebtoken";
import constant from '../constant/constans.js'
import logger from "../logger/logger.js";
import wrapper from "../helpers/wrapper.js"
import { BadRequest } from "../errors/BadRequest.js";

const generateToken = async (payload, expiresIn) => {
  const ctx = 'auth-generateToken'
  const secretKey = constant.SECRET_KEY
  const verifyOptions = { 
    algorithm: "HS256",
    expiresIn: expiresIn ? expiresIn : 12 * 60 *60 
  }
  try {
    return await jwt.sign(payload, secretKey, verifyOptions);
  } catch (error) {
    logger.log(ctx, error)
    return wrapper.response(res, 'fail', wrapper.error(new InternalServer(error)), 'Failed generate token', httpCode.UNAUTHORIZED);
  }
}

const verifyToken = async (req, res, next)=>{
  const ctx = 'middleware-verifyToken';
  const secretKey = constant.SECRET_KEY
  const verifyOptions = { 
    algorithm: "HS256",
  }
  if (!req.headers.authorization) {
    logger.log(ctx, 'Token required');
    return wrapper.response(res, 'fail', wrapper.error(new BadRequest('Token Required!!!')), '', httpCode.BAD_REQUEST);
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  if (!accessToken) {
    logger.log(ctx, 'Unauthorized');
    return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Unauthorized', httpCode.UNAUTHORIZED);
  }

  try {
    const user = jwt.verify(accessToken, secretKey, {...verifyOptions});
    
    const result = await prismaClient.user.findFirst({
      where: {
        username: user.username
      }
    })
    
    if (!result) {
      logger.log(ctx, 'Unauthorized');
      return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Unauthorized', httpCode.UNAUTHORIZED);
    }

    req.user = user;
  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.response(res, 'fail', wrapper.error(new Unauthorized(error)), 'Access token expired', httpCode.UNAUTHORIZED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return wrapper.response(res, 'fail', wrapper.error(new Unauthorized(error)), error.message, httpCode.UNAUTHORIZED);
    }
    return wrapper.response(res, 'fail', wrapper.error(new InternalServer(error)), null, httpCode.INTERNAL_SERVER);
  }
  next();
}

export {
  generateToken,
  verifyToken
}