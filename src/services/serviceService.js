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
        logger.error(ctx, 'Error retrieving services', error);
        return wrapper.error(new InternalServer());
    }
};


const updateService = async (payload) => {
    const ctx = 'serviceService-updateService';
    const { title, price, desc, status } = payload;
    try {
        const isExist = await prismaClient.service.findUnique({
            where: { title: title },
        });
        if (!isExist) {
            logger.log(ctx, 'Service not found');
            return wrapper.error(new BadRequest('Service not found'));
        }
        const result = await prismaClient.service.update({
            where: { title: title },
            data: {
                price,
                desc,
                status: status === "AVAILABLE" ? Avail.AVAILABLE : Avail.NON_AVAILABLE,
            },
        });
        console.log(`[${ctx}] Service updated successfully`);
        return wrapper.data(result, 'Success update service');
    } catch (error) {
        console.log(`[${ctx}] Error updating service: `, error);
        return wrapper.error(new InternalServer());
    }
};

const deleteService = async (title) => {
    const ctx = 'serviceService-deleteService';
    try {
        const isExist = await prismaClient.service.findUnique({
            where: {title: title},
        });
        if (!isExist){
            logger.log(ctx, 'Service not found');
            return wrapper.error(new BadRequest('Service not found'));
        }
        const result = await prismaClient.service.delete({
            where: { title: title },
        });
        console.log(`[${ctx}] Service deleted successfully`);
        return wrapper.data(result, 'Success delete service');
    } catch (error) {
        logger.log(ctx, error);
        console.error(`[${ctx}] Error deleting service:`, error);
        return wrapper.error(new InternalServer());
    }
};

export default {
    createService,
    getAllServices,
    updateService,
    deleteService,
}