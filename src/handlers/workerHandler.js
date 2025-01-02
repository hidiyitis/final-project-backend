import { workerCreateSchema } from "../validation/workerValidation.js";
import { validateSchema } from "../utils/validator/validator.js";
import wrapper from "../utils/helpers/wrapper.js";
import workerService from '../services/workerService.js';
import httpCode from "../utils/constant/httpCode.js";

const createWorker = async (req, res) => {
  const payload = req.body;
  const checkValidation = validateSchema(workerCreateSchema, payload);
  const postRequest = async(result) => {
    if (result.err) {
      return result;
    }
    return workerService.createWorker(result);
  };
  const sendResponse = async(result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed create worker', httpCode.INTERNAL_SERVER)
      : wrapper.response(res, 'success', result, 'Success create worker', httpCode.CREATED);
  };
  sendResponse(await postRequest(checkValidation));
};

const readAllWorkers = async (req, res) => {
    const getRequest = async () => {
      return workerService.getAllWorkers();
    };
  
    const sendResponse = async (result) => {
      result.err
        ? wrapper.response(res, "fail", result, "Failed membaca data pekerja", httpCode.NOT_FOUND)
        : wrapper.response(res, "success", result, "Success membaca data pekerja", httpCode.OK);
    };
  
    sendResponse(await getRequest());
  };

  const deleteWorkerHandler = async (req, res) => {
    const { email } = req.body; // Ambil email dari body request
  
    const getRequest = async () => {
      return workerService.deleteWorker(email);
    };
  
    const sendResponse = async (result) => {
      result.err
        ? wrapper.response(res, "fail", result, "Failed deleting worker", httpCode.NOT_FOUND)
        : wrapper.response(res, "success", result, "Worker deleted successfully", httpCode.OK);
    };
  
    sendResponse(await getRequest());
  };
  
  

export default {
  createWorker,
  readAllWorkers,
  deleteWorkerHandler
};