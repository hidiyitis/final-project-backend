import { prismaClient } from "../config/database.js";
import { Avail } from '@prisma/client';
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

const getAllServices = async () => {
    const ctx = 'serviceService-getAllServices';
    try {
        const result = await prismaClient.service.findMany();
         if (result.length == 0){
            logger.log(ctx, 'No services found')
            return wrapper.error(new BadRequest("No service found"));
        }
        return wrapper.data(result, 'Success retrieve all services');
    } catch (error) {
        return wrapper.error(new InternalServer());
    }
};


const updateService = async (payload) => {
    const ctx = 'serviceService-updateService';
    const { id } = payload;
    try {
        const isExist = await prismaClient.service.findUnique({
            where: { id: id },
        });
        if (!isExist) {
            return wrapper.error(new BadRequest('Service not found'));
        }
        const result = await prismaClient.service.update({
            where: { id: id },
            data: payload,
        });
        return wrapper.data(result, 'Success update service');
    } catch (error) {
        console.log(`[${ctx}] Error updating service: `, error);
        return wrapper.error(new InternalServer());
    }
};

const deleteService = async (title) => {
    try {
        const isExist = await prismaClient.service.findFirst({
            where: { title },
        });

        if (!isExist) {
            return { err: true, message: 'Service not found' };
        }

        const result = await prismaClient.service.delete({
            where: { title },
        });

        return { err: false, data: result };
    } catch (error) {
        console.error('Error in deleteService:', error);
        return { err: true, message: 'Internal Server Error' };
    }
};


export default {
    createService,
    getAllServices,
    updateService,
    deleteService,
}