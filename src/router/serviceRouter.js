import { Router } from "express";
import serviceHandler from "../handlers/serviceHandler.js";
import { verifyToken } from "../utils/middleware/jwtAuth.js";

const router = Router()

router.use(verifyToken);
router.post('/services', verifyToken, serviceHandler.createService);
router.get('/services', verifyToken, serviceHandler.getAllServices);
router.put('/services', verifyToken, serviceHandler.updateService);
router.delete('/services', verifyToken, serviceHandler.deleteService);

export default {router}