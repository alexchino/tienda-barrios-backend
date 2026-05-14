import Producto from "../models/productoModel.js";
import fs from "fs-extra"; // Para borrar imágenes viejas si se actualizan
import path from "path";

/**
 * ✅ OBTENER PRODUCTOS POR CATEGORÍA
 */
export const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { categoria_id } = req.params;
    
    // Validación de ID de categoría
    if (categoria_id.length !== 24) {
      return res.status(400).json({ mensaje: "ID de categoría no válido" });
    }

    const productos = await Producto.find({ categoria_id })
      .populate("categoria_id", "nombre")
      .populate("proveedor_id", "nombreEmpresa") 
      .sort({ createdAt: -1 });

    res.json(productos);
  } catch (error) {
    console.error("❌ Error al filtrar productos:", error.message);
    res.status(500).json({ mensaje: "Error al obtener productos por categoría" });
  }
};

/**
 * ✅ CREAR UN NUEVO PRODUCTO
 */
export const crearProducto = async (req, res) => {
  try {
    // 👈 ¡NUEVO! Agregamos codigo_barras a la desestructuración
    const { nombre, precio, stock, categoria_id, descripcion, proveedor_id, codigo_barras } = req.body;
    const imagen = req.file ? req.file.filename : null;

    // 🛡️ VALIDACIÓN DE SEGURIDAD PARA CATEGORÍA
    if (categoria_id && categoria_id.length !== 24) {
      return res.status(400).json({ 
        mensaje: "Error de formato", 
        detalle: `Se recibió '${categoria_id}', pero se esperaba un ID válido de MongoDB.` 
      });
    }

    // 🛡️ VALIDACIÓN DE SEGURIDAD PARA PROVEEDOR
    if (proveedor_id && proveedor_id.length !== 24) {
      return res.status(400).json({ 
        mensaje: "Error de formato", 
        detalle: `Se recibió '${proveedor_id}', pero se esperaba un ID válido de MongoDB para el proveedor.` 
      });
    }

    // Campos obligatorios
    if (!nombre || !precio || !categoria_id || !proveedor_id) {
      return res.status(400).json({ mensaje: "Nombre, precio, categoría y proveedor son obligatorios" });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio: parseFloat(precio), // Aseguramos que sea número
      stock: parseInt(stock) || 0,
      categoria_id,
      proveedor_id,
      codigo_barras: codigo_barras || "", // 👈 ¡NUEVO! Lo guardamos si viene, si no, queda vacío
      descripcion: descripcion || "",
      imagen: imagen
    });

    await nuevoProducto.save();
    
    // Devolvemos el producto poblado para que el Frontend lo vea bien de inmediato
    const productoGuardado = await Producto.findById(nuevoProducto._id)
      .populate("categoria_id", "nombre")
      .populate("proveedor_id", "nombreEmpresa"); 

    res.status(201).json({ 
      mensaje: "✅ Producto creado y guardado en Atlas", 
      producto: productoGuardado 
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(500).json({ mensaje: "Error interno al guardar", detalle: error.message });
  }
};

/**
 * ✅ OBTENER TODOS LOS PRODUCTOS
 */
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate("categoria_id", "nombre")
      .populate("proveedor_id", "nombreEmpresa") 
      .sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

/**
 * ✅ ACTUALIZAR PRODUCTO
 */
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    // Esto tomará automáticamente el codigo_barras y el proveedor_id si vienen en el frontend
    const datosActualizar = { ...req.body }; 

    // Buscar producto actual para manejar la imagen
    const productoPrevio = await Producto.findById(id);
    if (!productoPrevio) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (req.file) {
      // 🗑️ OPCIONAL: Borrar la imagen anterior del disco si existe una nueva
      if (productoPrevio.imagen) {
        const rutaImagen = path.resolve(`uploads/${productoPrevio.imagen}`);
        if (await fs.exists(rutaImagen)) await fs.unlink(rutaImagen);
      }
      datosActualizar.imagen = req.file.filename;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id, 
      datosActualizar, 
      { new: true, runValidators: true } // 'new: true' es el estándar moderno en Mongoose
    )
    .populate("categoria_id", "nombre")
    .populate("proveedor_id", "nombreEmpresa"); 

    res.json({ mensaje: "✅ Producto actualizado", producto: productoActualizado });
  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
};

/**
 * ✅ ELIMINAR PRODUCTO
 */
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    // 🗑️ Borrar imagen física antes de borrar de la DB
    if (producto.imagen) {
      const rutaImagen = path.resolve(`uploads/${producto.imagen}`);
      if (await fs.exists(rutaImagen)) await fs.unlink(rutaImagen);
    }

    await Producto.findByIdAndDelete(id);
    res.json({ mensaje: "🗑️ Producto e imagen eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
};