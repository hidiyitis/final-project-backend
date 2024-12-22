import { Router } from "express";
import userHandler from "../handlers/userHandler.js";

const router = Router()

router.post('/users', userHandler.createUser);
router.post('/users/login', userHandler.loginUser);

export default {router}