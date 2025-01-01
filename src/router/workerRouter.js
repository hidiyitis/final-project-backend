import { Router } from "express";
import workerHandler from "../handlers/workerHandler.js";
import { verifyToken } from "../utils/middleware/jwtAuth.js";

const router = Router()

router.post('/workers',verifyToken, workerHandler.createWorker);
router.get("/workers",verifyToken, workerHandler.readAllWorkers);
router.delete("/workers",verifyToken, workerHandler.deleteWorkerHandler);


export default {router}