import Proveedor from '../models/proveedorModel.js'; // Asegúrate de que la ruta coincida con la ubicación de tu modelo

// 1. Crear un nuevo proveedor (POST)
export const crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    const proveedorGuardado = await nuevoProveedor.save(); // Guarda el proveedor en MongoDB
    res.status(201).json({
      mensaje: 'Proveedor creado con éxito',
      proveedor: proveedorGuardado
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al crear el proveedor', 
      error: error.message 
    });
  }
};

// 2. Obtener todos los proveedores activos (GET)
export const obtenerProveedores = async (req, res) => {
  try {
    // Solo buscamos los que tienen estado en true (activos) para no mostrar los eliminados
    const proveedores = await Proveedor.find({ estado: true });
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los proveedores', 
      error: error.message 
    });
  }
};

// 3. Obtener un solo proveedor por ID (GET)
export const obtenerProveedorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findById(id);
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar el proveedor', 
      error: error.message 
    });
  }
};

// 4. Actualizar un proveedor (PUT)
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    // El { new: true } es para que Mongoose te devuelva el documento ya actualizado
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!proveedorActualizado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    res.status(200).json({
      mensaje: 'Proveedor actualizado correctamente',
      proveedor: proveedorActualizado
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al actualizar el proveedor', 
      error: error.message 
    });
  }
};

// 5. Eliminar (Desactivar) un proveedor (DELETE)
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    // Borrado lógico: En lugar de usar .findByIdAndDelete(), cambiamos el estado a false.
    // Esto evita que tus productos se queden sin la referencia del proveedor en el historial.
    const proveedorEliminado = await Proveedor.findByIdAndUpdate(id, { estado: false }, { new: true });
    
    if (!proveedorEliminado) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    res.status(200).json({ mensaje: 'Proveedor desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar el proveedor', 
      error: error.message 
    });
  }
};