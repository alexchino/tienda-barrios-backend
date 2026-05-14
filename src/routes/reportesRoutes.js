import express from "express";
import { obtenerReportes } from "../controllers/reportesController.js";

const router = express.Router();

// ✅ GET a /api/reportes
router.get("/", obtenerReportes);

export default router;