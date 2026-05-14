import { Router } from 'express';
import { 
  crearProveedor, 
  obtenerProveedores, 
  obtenerProveedorPorId, 
  actualizarProveedor, 
  eliminarProveedor 
} from '../controllers/proveedorController.js';

const router = Router();

// Definimos los endpoints para la ruta /api/proveedores
router.post('/', crearProveedor);          // POST: Para guardar un nuevo proveedor
router.get('/', obtenerProveedores);         // GET: Para listar todos los proveedores activos
router.get('/:id', obtenerProveedorPorId);   // GET: Para ver detalles de uno solo
router.put('/:id', actualizarProveedor);     // PUT: Para editar
router.delete('/:id', eliminarProveedor);    // DELETE: Para desactivar

export default router;