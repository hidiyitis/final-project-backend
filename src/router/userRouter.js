import { Router } from "express";
import userHandler from "../handlers/userHandler.js";
import { verifyToken } from "../utils/middleware/jwtAuth.js";

const router = Router()

router.post('/users', verifyToken, userHandler.createUser);
router.post('/users/login', userHandler.loginUser);
router.get('/users', verifyToken, userHandler.getUsers);
router.get('/users/:id', verifyToken, userHandler.getUserById);
router.put('/users/:id', verifyToken, userHandler.updateUser);
router.delete('/users/:id', verifyToken, userHandler.deleteUser);

export default {router}