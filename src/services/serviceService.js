import { prismaClient } from "../config/database.js";
import { BadRequest, InternalServer } from "../utils/errors/index.js";
import wrapper from "../utils/helpers/wrapper.js";
import logger from "../utils/logger/logger.js";

const createService = async (payload) => {
    const ctx = 'serviceService-createService'
    const { title } = payload;
    try {
        const isExistService = await prismaClient.service.count({
            where: {
                OR: [
                    { title : title }
                ]
            }
        });
        if (isExistService === 1){
            logger.log(ctx, 'Service already exist');
            return wrapper.error(new BadRequest('Service already exist'));
        }
        const result = await prismaClient.service.create({data: payload});
        return wrapper.data(result, 'Success create service');

    } catch (error){
        return wrapper.error(new InternalServer());
    }
}

const getAllServices = async (payload) => {
    const {status} = payload
    try {
        const result = await prismaClient.service.findMany({
            where :{
                status: status
            }
        });
         if (result.length == 0){
            logger.log('No services found', result);
            return wrapper.error(new BadRequest("No service found"));
        }
        return wrapper.data(result, 'Success retrieve all services');
    } catch (error) {
        return wrapper.error(new InternalServer());
    }
};


const updateService = async (payload) => {
    const { id, ...data } = payload;
    try {
        const isExist = await prismaClient.service.findUnique({
            where: { id: parseInt(id) },
        });
        if (!isExist) {
            return wrapper.error(new BadRequest('Service not found'));
        }
        const result = await prismaClient.service.update({
            where: { id: parseInt(id) },
            data: data,
        });
        return wrapper.data(result, 'Success update service');
    } catch (error) {
        logger.log(`Error updating service: `, error);
        return wrapper.error(new InternalServer());
    }
};

const deleteService = async (payload) => {
    try {
        const isExist = await prismaClient.service.findFirst({
            where: { id: parseInt(payload) },
        });

        if (!isExist) {
            return { err: true, message: 'Service not found' };
        }

        const result = await prismaClient.service.delete({
            where: { id: parseInt(payload) },
        });

        return wrapper.data(result, 'Success delete service');
    } catch (error) {
        logger.log('Error in deleteService:', error);
        return wrapper.data(result, 'Failed delete service');
    }
};

export default {
    createService,
    getAllServices,
    updateService,
    deleteService,
}