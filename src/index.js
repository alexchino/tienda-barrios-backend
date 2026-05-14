import express from "express";
import cors from "cors";
import path from "path";
import productoRoutes from "./routes/productoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import { config } from "./config/config.js";
import { pool, getConnection } from "./config/db.js"; // Mantenemos los imports originales
import ventasRoutes from "./routes/ventasRoutes.js";
import clienteRoutes from "./routes/clientesRoutes.js";
import cotizacionesRoutes from "./routes/cotizacionesRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";
import { registrarVenta } from "./controllers/ventasController.js";
import { fileURLToPath } from 'url';
import proveedorRoutes from "./routes/proveedorRoutes.js"; // Importamos las rutas de proveedores

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB Atlas (Mantenemos tu bloque async)
(async () => {
  try {
    await getConnection(); 
    console.log("🟢 Conectado correctamente a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error crítico: No se pudo establecer conexión inicial.");
  }
})();

// ✅ Rutas (Manteniendo tus nombres exactos)
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes); // Agregamos la ruta de proveedores
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/login", usuarioRoutes);
app.use("/api/reportes", reportesRoutes);
app.post("/api/ventas/registrar", registrarVenta);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// ✅ Ruta base
app.get("/", (req, res) => {
  res.send("🚀 API del Sistema de Ventas (MongoDB) funcionando correctamente");
});

// ✅ Iniciar servidor
app.listen(config.app.port, () => {
  console.log(`✅ Servidor corriendo en puerto ${config.app.port}`);
});