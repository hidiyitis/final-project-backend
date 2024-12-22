import { prismaClient } from "../config/database.js";
import { InternalServer } from "../utils/errors/InternalServer.js";
import logger from "../utils/logger/logger.js";
import wrapper from "../utils/helpers/wrapper.js";

const createOrder = async (payload)=>{
  const ctx = 'orderService-createOrder'
  try {
    const result = await prismaClient.order.create({data: payload});
    return wrapper.data(result);
  } catch (error) {
    logger.log(ctx, error);
    return wrapper.error(new InternalServer(error));
  }
}

const findOrderById = async (payload)=>{
  const {id} = payload;
  try {
    const result = await prismaClient.order.findUnique({
      where: {
        id: id
      },
      include: {
        pic: true
      }
    });
    return wrapper.data(result);
  } catch (error) {
    logger.log(ctx, error);
    return wrapper.error(new InternalServer(error));
  }
}

const updateOrder = async (payload)=>{
  const ctx = 'orderService-updateOrder'
  try {
    const result = await prismaClient.order.update({
      where: {
        id: payload.id
      },
      data: payload
    });
    return wrapper.data(result);
  } catch (error) {
    logger.log(ctx, error);
    return wrapper.error(new InternalServer(error));
  }
}

const getOrders = async (payload)=>{
  const { search } = payload
  try {
    const result =  await prismaClient.order.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      }
    })
    return wrapper.data(result);
  } catch (error) {
    return wrapper.error(new InternalServer(error));
  }
}

export default {
  createOrder,
  findOrderById,
  updateOrder,
  getOrders
}