import { Router } from "express";
import orderHandler from "../handlers/orderHandler.js";
import { verifyToken } from "../utils/middleware/jwtAuth.js";

const router = Router()

router.use(verifyToken);
router.post('/orders', orderHandler.createOrder);
router.get('/orders/:id', orderHandler.findOrderById);
router.put('/orders/:id', orderHandler.updateOrder);
router.get('/orders', orderHandler.getOrders);

export default {router}