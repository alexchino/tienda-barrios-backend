import Venta from "../models/ventaModel.js";
import Producto from "../models/productoModel.js";

// ✅ REGISTRAR UNA NUEVA VENTA (Llamado desde Ventas.jsx)
export const registrarVenta = async (req, res) => {
  try {
    // 1. Extraemos los nuevos campos (Correo y Telefono) que manda React
    const { ClienteID, Nombre, Apellido, Correo, Telefono, DUI, productos, metodoPago } = req.body;

    let subtotalGeneral = 0;
    const productosVenta = [];

    // 2. Verificar stock y preparar el detalle de la venta
    for (const item of productos) {
      const productoDB = await Producto.findById(item.ProductID);
      
      if (!productoDB) {
        return res.status(404).json({ mensaje: `Producto no encontrado` });
      }
      if (productoDB.stock < item.Cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${productoDB.nombre}` });
      }

      const subtotalItem = productoDB.precio * item.Cantidad;
      subtotalGeneral += subtotalItem;

      productosVenta.push({
        producto_id: productoDB._id,
        nombre: productoDB.nombre,
        cantidad: item.Cantidad,
        precio: productoDB.precio, // Guardamos el precio histórico
        subtotal: subtotalItem
      });
    }

    // 3. Cálculos Salvadoreños
    const iva = subtotalGeneral * 0.13;
    const total = subtotalGeneral + iva;
    const numeroTicket = `TKT-${Date.now().toString().slice(-6)}`;

    // 4. Crear el registro de Venta (Añadiendo Correo y Teléfono)
    const nuevaVenta = new Venta({
      cliente_id: ClienteID ? ClienteID : undefined, // Puede ser null si es "Consumidor Final"
      nombre_cliente: Nombre,
      apellido_cliente: Apellido,
      correo_cliente: Correo || "",     // ✅ Guardamos el correo
      telefono_cliente: Telefono || "", // ✅ Guardamos el teléfono
      dui_cliente: DUI || "",
      productos: productosVenta,
      subtotal: subtotalGeneral,
      iva,
      total,
      metodoPago,
      numeroTicket
    });

    await nuevaVenta.save();

    // 5. Descontar el stock de los productos
    for (const item of productos) {
      await Producto.findByIdAndUpdate(item.ProductID, {
        $inc: { stock: -item.Cantidad } // Resta la cantidad vendida
      });
    }

    res.status(201).json({
      mensaje: "Venta registrada exitosamente",
      VentaID: nuevaVenta._id,
      NumeroTicket: numeroTicket,
      Total: total
    });

  } catch (error) {
    console.error("❌ Error en registrarVenta:", error);
    res.status(500).json({ mensaje: "Error interno al procesar la venta" });
  }
};

// ✅ OBTENER HISTORIAL (Llamado desde VentasHistorial.jsx)
export const obtenerHistorialVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate("cliente_id", "nombre email") // Trae datos básicos del cliente si existe
      .sort({ createdAt: -1 }); // Las más recientes primero

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener historial" });
  }
};