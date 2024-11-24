import { Router } from "express";
import userHandler from "../handlers/userHandler.js";

const router = Router()

router.post('/users', userHandler.createUser);

export default {router}