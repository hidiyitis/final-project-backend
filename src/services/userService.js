import { prismaClient } from "../config/database.js";
import { BadRequest } from "../utils/errors/BadRequest.js";
import { InternalServer } from "../utils/errors/InternalServer.js";
import { genSalt, hash } from "bcrypt";
import { generateToken } from "../utils/middleware/jwtAuth.js";
import logger from "../utils/logger/logger.js";
import wrapper from "../utils/helpers/wrapper.js"

const createUser = async (payload)=>{
  const ctx = 'userService-createUser'
  const { email } = payload;
  try {
    const isExistUser = await prismaClient.user.count({
      where: {
        OR: [
          { email: email }
        ]
      }
    });
    if (isExistUser===1) {
      logger.log(ctx, 'User already exist');
      return wrapper.error(new BadRequest('User already exist'));
    }
    const salt = await genSalt(10);
    const encryptedPassword = await hash(payload.password, salt);
    delete payload.password;
    const accessTokenExpiresIn = 30*60
    const refreshTokenTokenExpiresIn = 6*60*60
    const accessToken = await generateToken(payload, accessTokenExpiresIn);
    const refreshToken = await generateToken(payload, refreshTokenTokenExpiresIn);
    const data = {
      ...payload,
      password: encryptedPassword,
      accessToken,
      refreshToken
    }
    const result = await prismaClient.user.create({
      data: data, 
      omit:{
        password: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return wrapper.data({ ...result, accessTokenExpiresIn, refreshTokenTokenExpiresIn }, 'Success create user');
  } catch (error) {
    return wrapper.error(new InternalServer());
  }
}

export default {
  createUser,
}