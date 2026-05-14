import Venta from "../models/ventaModel.js";
import Producto from "../models/productoModel.js";

export const obtenerReportes = async (req, res) => {
  try {
    // 1. Obtener todas las colecciones necesarias
    const ventas = await Venta.find();
    const totalProductos = await Producto.countDocuments(); // Cuenta cuántos repuestos tienes

    // 2. Variables para Resumen General
    const totalVentas = ventas.length;
    const totalGanancia = ventas.reduce((suma, venta) => suma + venta.total, 0);

    // 3. Variables para Ventas Mensuales y Top Productos
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const registroMeses = {};
    const registroProductos = {};

    // 4. Recorrer cada venta para agrupar datos
    ventas.forEach((venta) => {
      // Agrupar por Mes
      const fecha = new Date(venta.createdAt);
      const nombreMes = nombresMeses[fecha.getMonth()] + " " + fecha.getFullYear();
      
      if (!registroMeses[nombreMes]) registroMeses[nombreMes] = 0;
      registroMeses[nombreMes] += venta.total;

      // Agrupar por Producto
      venta.productos.forEach((prod) => {
        if (!registroProductos[prod.nombre]) registroProductos[prod.nombre] = 0;
        registroProductos[prod.nombre] += prod.cantidad;
      });
    });

    // 5. Formatear Ventas por Mes a un Arreglo (Array)
    const ventasPorMes = Object.keys(registroMeses).map(mes => ({
      mes: mes,
      total: registroMeses[mes]
    }));

    // 6. Formatear y Ordenar los Productos Más Vendidos (Top 5)
    const productosMasVendidos = Object.keys(registroProductos)
      .map(nombre => ({ nombre, cantidadVendido: registroProductos[nombre] }))
      .sort((a, b) => b.cantidadVendido - a.cantidadVendido) // Ordena de mayor a menor
      .slice(0, 5); // Corta solo los primeros 5

    // 7. Enviar todo al Frontend
    res.json({
      resumenGeneral: { totalVentas, totalGanancia, totalProductos },
      ventasPorMes,
      productosMasVendidos
    });

  } catch (error) {
    console.error("❌ Error generando reportes:", error);
    res.status(500).json({ mensaje: "Error interno al generar los reportes." });
  }
};