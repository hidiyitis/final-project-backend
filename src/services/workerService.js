import { prismaClient } from "../config/database.js";
import { BadRequest } from "../utils/errors/BadRequest.js";
import { InternalServer } from "../utils/errors/InternalServer.js";
import { genSalt, hash } from "bcrypt";
import { generateToken } from "../utils/middleware/jwtAuth.js";
import logger from "../utils/logger/logger.js";
import wrapper from "../utils/helpers/wrapper.js"

const createWorker = async (payload)=>{
  const ctx = 'workerService-createWorker'
  const { email } = payload;
  try {
    const isExistUser = await prismaClient.worker.count({
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
    const result = await prismaClient.worker.create({data: payload});
    return wrapper.data(result, 'Success create user');
  } catch (error) {
    return wrapper.error(new InternalServer());
  }
}

const getAllWorkers = async () => {
    const ctx = "workerService-getAllWorkers";
  
    try {
      const workers = await prismaClient.worker.findMany();
      if (workers.length === 0) {
        logger.log(ctx, "No workers found");
        return wrapper.error(new BadRequest("No workers found"));
      }
      return wrapper.data(workers, "Success reading all workers");
    } catch (error) {
      logger.log(ctx, `Error retrieving workers: ${error.message}`);
      return wrapper.error(new InternalServer());
    }
  };

  const deleteWorker = async (email) => {
    const ctx = "workerService-deleteWorker";
  
    try { 
      if (!email) {
        logger.log(ctx, "Email is required to delete a worker");
        return wrapper.error(new BadRequest("Email is required"));
      }
  
      
      const worker = await prismaClient.worker.findUnique({
        where: { email: email },
      });
  
      if (!worker) {
        logger.log(ctx, `Worker not found for Email: ${email}`);
        return wrapper.error(new BadRequest("Worker not found"));
      }
  
      const deletedWorker = await prismaClient.worker.delete({
        where: { email: email },
      });
  
      logger.log(ctx, `Worker deleted successfully: ${JSON.stringify(deletedWorker)}`);
      return wrapper.data(deletedWorker, "Worker deleted successfully");
    } catch (error) {
      logger.log(ctx, `Error deleting worker: ${error.message}`);
      console.error("Full error:", error); 
      return wrapper.error(new InternalServer());
    }
  };
  
  const searchWorker = async (name) => {
    const ctx = "workerService-searchWorker";
    try {
      if (!name) {
        logger.log(ctx, "Name is required to search a worker");
        return wrapper.error(new BadRequest("Name is required"));
      }
  
      const workers = await prismaClient.worker.findMany({
        where: {
          name: {
            contains: name, // Mendukung pencarian sebagian
            mode: "insensitive", // Tidak peka huruf besar/kecil
          },
        },
      });
  
      if (workers.length === 0) {
        logger.log(ctx, `No workers found for name: ${name}`);
        return wrapper.error(new BadRequest("No workers found"));
      }
  
      return wrapper.data(workers, "Success searching workers");
    } catch (error) {
      logger.log(ctx, `Error searching workers: ${error.message}`);
      return wrapper.error(new InternalServer());
    }
  };
  
  
  export default {
    createWorker,
    getAllWorkers,
    deleteWorker,
    searchWorker
  };