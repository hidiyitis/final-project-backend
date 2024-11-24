import { prismaClient } from "../../config/database.js";
import httpCode from "../constant/httpCode.js"
import { InternalServer } from "../errors/InternalServer.js";
import { Unauthorized } from "../errors/Unauthorized.js"
import jwt from "jsonwebtoken";
import constant from '../constant/constans.js'
import logger from "../logger/logger.js";
import wrapper from "../helpers/wrapper.js"

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
    return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Unauthorized', httpCode.UNAUTHORIZED);
  }
}

const verifyToken = async (req, res, next)=>{
  const ctx = 'middleware-verifyToken';
  const secretKey = constant.SECRET_KEY
  const verifyOptions = { 
    algorithm: "HS256",
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  if (!accessToken) {
    logger.log(ctx, 'Unauthorized');
    return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Unauthorized', httpCode.UNAUTHORIZED);
  }

  try {
    jwt.verify(accessToken, secretKey, {...verifyOptions});

    const result = await prismaClient.user.count({
      where: {
        accessToken: accessToken
      }
    })

    if (result===0) {
      logger.log(ctx, 'Unauthorized');
      return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Unauthorized', httpCode.UNAUTHORIZED);
    }

    req.user = result;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.response(res, 'fail', wrapper.error(new Unauthorized()), 'Access token expired', httpCode.UNAUTHORIZED);
    }
    return wrapper.response(res, 'fail', wrapper.error(new InternalServer()), null, httpCode.INTERNAL_SERVER);
  }
  next();
}

export {
  generateToken,
  verifyToken
}