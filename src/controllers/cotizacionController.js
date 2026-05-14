import Cotizacion from '../models/cotizacionModel.js';

/**
 * ✅ CREAR / GUARDAR COTIZACIÓN
 */
export const guardarCotizacion = async (req, res) => {
  try {
    const nuevaCotizacion = new Cotizacion(req.body);
    await nuevaCotizacion.save();
    res.status(201).json({ mensaje: "📝 Cotización guardada con éxito", id: nuevaCotizacion._id });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al guardar cotización", error: error.message });
  }
};

/**
 * ✅ OBTENER TODAS LAS COTIZACIONES (Para el Historial)
 */
export const obtenerCotizaciones = async (req, res) => {
  try {
    const lista = await Cotizacion.find().sort({ createdAt: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener lista" });
  }
};

/**
 * ✅ OBTENER UNA COTIZACIÓN POR SU ID (Para cargarla al Editar)
 */
export const obtenerCotizacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await Cotizacion.findById(id); 
    
    if (!cotizacion) {
      return res.status(404).json({ mensaje: "Cotización no encontrada" });
    }
    
    res.json(cotizacion);
  } catch (error) {
    console.error("❌ Error al obtener cotización:", error);
    res.status(500).json({ mensaje: "Error interno al buscar la cotización" });
  }
};

/**
 * ✅ ACTUALIZAR UNA COTIZACIÓN (Sirve para Editar y para Pagar)
 */
export const actualizarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const cotizacion = await Cotizacion.findByIdAndUpdate(
      id, 
      datosActualizados, 
      { new: true } // Para que devuelva el documento ya modificado
    );

    if (!cotizacion) {
      return res.status(404).json({ mensaje: "Cotización no encontrada para actualizar" });
    }

    res.json({ mensaje: "✅ Cotización actualizada", cotizacion });
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    res.status(500).json({ mensaje: "Error interno al actualizar" });
  }
};

/**
 * ✅ ELIMINAR UNA COTIZACIÓN
 */
export const eliminarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cotizacion = await Cotizacion.findByIdAndDelete(id);

    if (!cotizacion) {
      return res.status(404).json({ mensaje: "Cotización no encontrada para eliminar" });
    }

    res.json({ mensaje: "🗑️ Cotización eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    res.status(500).json({ mensaje: "Error al eliminar la cotización" });
  }
};