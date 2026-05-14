import  Categoria  from "../models/categoriaModel.js";
import  Producto from "../models/productoModel.js"; // Importamos Producto para la validación de borrado

// ✅ Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    // Reemplaza SELECT * FROM categorias ORDER BY id ASC
    // .sort({ nombre: 1 }) las ordena alfabéticamente
    const categorias = await Categoria.find().sort({ nombre: 1 });
    
    // Mapeamos para que el Frontend reciba 'id' en lugar de '_id' si lo necesita
    const respuesta = categorias.map(c => ({
      id: c._id,
      nombre: c.nombre,
      descripcion: c.descripcion
    }));

    res.json(respuesta);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error.message);
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
};

// ✅ Crear una nueva categoría
// ✅ Crear una nueva categoría (Versión Corregida)
export const crearCategoria = async (req, res) => {
  try {
    console.log("📂 Datos recibidos:", req.body);

    // Extraemos probando ambos nombres (minúscula y Mayúscula)
    const nombre = req.body.nombre || req.body.Nombre;
    const descripcion = req.body.descripcion || req.body.Descripcion;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio (Llegó vacío)" });
    }

    const nuevaCategoria = new Categoria({
      nombre: nombre.trim(),
      descripcion: descripcion || ""
    });

    const resultado = await nuevaCategoria.save();

    res.status(201).json({ 
      message: "✅ Categoría creada correctamente", 
      categoria: resultado 
    });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error.message);
    res.status(500).json({ message: "Error interno al crear", detalle: error.message });
  }
};
// ✅ Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "✅ Categoría actualizada correctamente", categoria: categoriaActualizada });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error.message);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

// ✅ Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔎 Verificar si hay productos asociados en MongoDB
    const productosAsociados = await Producto.countDocuments({ categoria_id: id });

    if (productosAsociados > 0) {
      return res.status(400).json({
        message: `❌ No se puede eliminar: Hay ${productosAsociados} productos vinculados a esta categoría`,
      });
    }

    // 🗑️ Eliminar de Atlas
    const eliminada = await Categoria.findByIdAndDelete(id);

    if (!eliminada) return res.status(404).json({ message: "Categoría no encontrada" });

    res.json({ message: "🗑️ Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error.message);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};