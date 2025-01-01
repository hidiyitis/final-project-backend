import { Router } from "express";
import orderHandler from "../handlers/orderHandler.js";
import { verifyToken } from "../utils/middleware/jwtAuth.js";

const router = Router()

router.post('/orders',verifyToken, orderHandler.createOrder);
router.get('/orders/:id', verifyToken, orderHandler.findOrderById);
router.put('/orders/:id', verifyToken, orderHandler.updateOrder);
router.get('/orders', verifyToken,  orderHandler.getOrders);

export default {router}