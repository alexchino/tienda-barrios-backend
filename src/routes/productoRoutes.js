import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorCategoria,
} from "../controllers/productoController.js";

const router = express.Router();

/* ==========================================
   ☁️ CONFIGURACIÓN DE CLOUDINARY
========================================== */
// Le damos a Cloudinary las llaves que guardaste en tu archivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuramos Multer para que envíe el archivo directamente a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tienda-barrios", // Las fotos se guardarán en esta carpeta dentro de Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Formatos permitidos
  },
});

const uploadMiddleware = multer({ storage });

/* ==========================================
   🚀 RUTAS DE PRODUCTOS
========================================== */

// 1. Obtener productos filtrados por categoría
router.get("/categoria/:categoria_id", obtenerProductosPorCategoria);

// 2. Obtener todos los productos
router.get("/", obtenerProductos);

// 3. Crear producto (El campo en el FormData debe ser "imagen")
router.post("/", uploadMiddleware.single("imagen"), crearProducto);

// 4. Actualizar producto
router.put("/:id", uploadMiddleware.single("imagen"), actualizarProducto);

// 5. Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;