import { Router } from "express";
import serviceHandler from "../handlers/serviceHandler.js";

const router = Router()

router.post('/services', serviceHandler.createService);
router.get('/services', serviceHandler.getAllServices);
router.put('/services', serviceHandler.updateService);
router.delete('/services', serviceHandler.deleteService);

export default {router}