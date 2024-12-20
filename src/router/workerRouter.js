import { Router } from "express";
import workerHandler from "../handlers/workerHandler.js";

const router = Router()

router.post('/workers', workerHandler.createWorker);
router.get("/workers", workerHandler.readAllWorkers);
router.delete("/workers", workerHandler.deleteWorkerHandler);


export default {router}