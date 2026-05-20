import Producto from "../models/productoModel.js";

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
    const { nombre, precio, stock, categoria_id, descripcion, proveedor_id, codigo_barras } = req.body;
    
    // ☁️ MODIFICADO: Guardamos la URL completa (.path) de Cloudinary si existe
    const imagen = req.file ? req.file.path : "default.png";

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
      precio: parseFloat(precio), 
      stock: parseInt(stock) || 0,
      categoria_id,
      proveedor_id,
      codigo_barras: codigo_barras || "", 
      descripcion: descripcion || "",
      imagen: imagen // Guardará algo como: https://res.cloudinary.com/...
    });

    await nuevoProducto.save();
    
    const productoGuardado = await Producto.findById(nuevoProducto._id)
      .populate("categoria_id", "nombre")
      .populate("proveedor_id", "nombreEmpresa"); 

    res.status(201).json({ 
      mensaje: "✅ Producto creado y guardado en Atlas con imagen en la nube", 
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
    const datosActualizar = { ...req.body }; 

    // Buscar producto actual
    const productoPrevio = await Producto.findById(id);
    if (!productoPrevio) return res.status(404).json({ mensaje: "Producto no encontrado" });

    // ☁️ MODIFICADO: Si el usuario sube una nueva foto, capturamos el .path de Cloudinary
    if (req.file) {
      datosActualizar.imagen = req.file.path;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id, 
      datosActualizar, 
      { new: true, runValidators: true } 
    )
    .populate("categoria_id", "nombre")
    .populate("proveedor_id", "nombreEmpresa"); 

    res.json({ mensaje: "✅ Producto actualizado con éxito", producto: productoActualizado });
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

    await Producto.findByIdAndDelete(id);
    res.json({ mensaje: "🗑️ Producto eliminado correctamente de la base de datos" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
};