import { prismaClient } from "../config/database.js";
import { BadRequest } from "../utils/errors/BadRequest.js";
import { InternalServer } from "../utils/errors/InternalServer.js";
import { genSalt, hash, compare } from "bcrypt";
import { generateToken } from "../utils/middleware/jwtAuth.js";
import logger from "../utils/logger/logger.js";
import wrapper from "../utils/helpers/wrapper.js";
import { Unauthorized } from "../utils/errors/Unauthorized.js";
import { NotFound } from "../utils/errors/NotFound.js";

const createUser = async (payload)=>{
  const ctx = 'userService-createUser'
  const { username } = payload;
  try {
    const isExistUser = await prismaClient.user.count({
      where: {
        OR: [
          { username: username }
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
    return wrapper.data({ ...result, accessToken, accessTokenExpiresIn, refreshTokenTokenExpiresIn }, 'Success create user');
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

const loginUser = async (payload)=>{
  const { username, password } = payload;
  try {
    const userIsExist = await prismaClient.user.findFirst({
      where: {
        username: username
      }
    })
    if (!userIsExist) {
      return wrapper.error(new Unauthorized(`Username and password didn't match`));
    }
    const checkPassword = await compare(password, userIsExist.password);
    if (!checkPassword) {
      return wrapper.error(new Unauthorized(`Username and password didn't match`));
    };
    const payloadToken = {
      id: userIsExist.id,
      name: userIsExist.name,
      username: userIsExist.username,
      accessRole: userIsExist.accessRole,
    }
    
    const accessTokenExpiresIn = 30*60;
    const refreshTokenTokenExpiresIn = 6*60*60;
    const accessToken = await generateToken(payloadToken, accessTokenExpiresIn);
    const refreshToken = await generateToken(payloadToken, refreshTokenTokenExpiresIn);
    const result = {
      id: userIsExist.id,
      name: userIsExist.name,
      username: userIsExist.username,
      accessRole: userIsExist.accessRole,
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenTokenExpiresIn
    };
    await prismaClient.user.update({
      where: {
        username: username
      },
      data: {
        refreshToken: refreshToken
      }
    })
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

const getUsers = async () => {
  try {
    const result = await prismaClient.user.findMany()
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

const getUserById = async (payload) => {
  const { id } = payload
  try {
    const result = await prismaClient.user.findFirst({
      where:{
        id: id
      }
    })
    if (!result) {
      return wrapper.error(new NotFound('Data not found'));
    }
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

const updateUser = async (payload) => {
  const {id} = payload;
  const salt = await genSalt(10);

  try {
    const isExistUser = await prismaClient.user.findFirst({
      where:{
        id: id
      }
    })
    
    if (!isExistUser) {
      return wrapper.error(new BadRequest())
    }
    if(isExistUser.password !== payload.password){
      const encryptedPassword = await hash(payload.password, salt);
      payload.password = encryptedPassword;
    }
    const result = await prismaClient.user.update({
      where:{
        id: id
      },
      data: payload
    })
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

const deleteUser = async (payload) => {
  try {
    const result = await prismaClient.user.delete({
      where: {
        id: parseInt(payload)
      }
    })
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

export default {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}