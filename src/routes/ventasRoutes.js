import express from "express";
import {
  registrarVenta,
  obtenerHistorialVentas
} from "../controllers/ventasController.js";

const router = express.Router();

// ✅ REGISTRAR VENTA: POST a /api/ventas/registrar
router.post("/registrar", registrarVenta);

// ✅ OBTENER HISTORIAL: GET a /api/ventas
router.get("/", obtenerHistorialVentas);

export default router;