import express from "express";
import * as adminController from "../controllers/adminController.js";
const router = express.Router();

router.get('/dashboard', adminController.getDashBoard);

export default router;