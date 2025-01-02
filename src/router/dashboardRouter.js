import { Router } from "express";
import dashboardHandler from "../handlers/dashboardHandler.js";

const router = Router();

// router.get('/dashboard', dashboardHandler.getDashboard);
router.get("/dashboard/card", dashboardHandler.getDashboardCard);
router.get("/dashboard/chart", dashboardHandler.getDashboardChart);

export default {router};