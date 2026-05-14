import express from "express";
import multer from "multer";
import path from "path";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorCategoria,
} from "../controllers/productoController.js";

const router = express.Router();

/* ==========================================
   ⚙️ CONFIGURACIÓN DE MULTER
========================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La carpeta "uploads" debe estar en la raíz del proyecto
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Guardamos con la fecha actual para evitar nombres duplicados
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Definimos la constante una sola vez
const uploadMiddleware = multer({ storage });

/* ==========================================
   🚀 RUTAS DE PRODUCTOS
========================================== */

// 1. Obtener productos filtrados por categoría
router.get("/categoria/:categoria_id", obtenerProductosPorCategoria);

// 2. Obtener todos los productos
router.get("/", obtenerProductos);

// 3. Crear producto (El campo en el FormData debe ser "imagen")
// He cambiado "Imagen" a "imagen" para que coincida con tu controlador
router.post("/", uploadMiddleware.single("imagen"), crearProducto);

// 4. Actualizar producto
router.put("/:id", uploadMiddleware.single("imagen"), actualizarProducto);

// 5. Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;