import express from "express";
import { 
  guardarCotizacion, 
  obtenerCotizaciones, 
  obtenerCotizacionPorId,
  actualizarCotizacion,
  eliminarCotizacion
} from "../controllers/cotizacionController.js";

const router = express.Router();

// Rutas generales
router.post("/", guardarCotizacion);        // Crear nueva
router.get("/", obtenerCotizaciones);       // Listar todas

// Rutas específicas por ID
router.get("/:id", obtenerCotizacionPorId); // Cargar una para editar
router.put("/:id", actualizarCotizacion);   // Actualizar datos o cambiar estado a "Pagado"
router.delete("/:id", eliminarCotizacion);  // Borrar

export default router;