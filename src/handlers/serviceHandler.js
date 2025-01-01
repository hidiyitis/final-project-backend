import wrapper from "../utils/helpers/wrapper.js";
import { validateSchema } from "../utils/validator/validator.js";
import { serviceCreateSchema, serviceUpdateSchema } from "../validation/serviceValidation.js";
import httpCode from "../utils/constant/httpCode.js";
import serviceService from "../services/serviceService.js";

const createService = async (req, res) => {
    const payload = req.body;
    const checkValidation = validateSchema(serviceCreateSchema, payload);
    const postRequest = async(result) => {
        if (result.err){
            return result;
        }
        return serviceService.createService(result);
    }
    const sendResponse = async(result) => {
        (result.err)
        ? wrapper.response(res, 'fail', result, 'Failed create service', httpCode.INTERNAL_SERVER)
        :wrapper.response(res, 'success', result, 'Succes create service', httpCode.CREATED);
    };
    sendResponse(await postRequest(checkValidation));
}

const updateService = async (req, res) => {
    const payload = req.body;
    const checkValidation = validateSchema(serviceUpdateSchema, payload);
    const updateRequest = async(result) => {
        if (result.err) {
            return result;
        }
        return serviceService.updateService(result);
    };
    const sendResponse = async(result) => {
        (result.err)
        ? wrapper.response(res, 'fail', result, 'Failed update service', httpCode.INTERNAL_SERVER)
        : wrapper.response(res, 'success', result, 'Success update service', httpCode.OK);
    };
    sendResponse(await updateRequest(checkValidation));

}

const getAllServices = async (req, res) => {
    const ReadRequest = async(result) => {
        return serviceService.getAllServices(result);
    }
    const sendResponse = async(result) => {
        (result.err)
        ? wrapper.response(res, 'fail', result, 'Failed read service', httpCode.INTERNAL_SERVER)
        :wrapper.response(res, 'success', result, 'Success read service', httpCode.CREATED);
    };
    sendResponse(await ReadRequest());
}

const deleteService = async (req, res) => {
    const { id } = req.body;
    const deleteRequest = async() => {
        return serviceService.deleteService(id);
    }
    const sendResponse = async(result) => {
        (result.err)
        ? wrapper.response(res, 'fail', result, 'Failed delete service', httpCode.INTERNAL_SERVER)
        :wrapper.response(res, 'success', result, 'Success delete service', httpCode.CREATED);
    };
    sendResponse(await deleteRequest());
}

export default {
    createService,
    updateService,
    getAllServices,
    deleteService,
}