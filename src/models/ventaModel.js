import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: false // Puede ser nulo si es "Consumidor Final" sin registro
  },
  nombre_cliente: { type: String, required: true },
  apellido_cliente: { type: String, required: true },
  correo_cliente: { type: String, default: "" }, 
  telefono_cliente: { type: String, default: "" },
  dui_cliente: { type: String, default: "" }, // ✅ Agregamos el DUI aquí para que Mongoose lo guarde

  productos: [
    {
      producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true }, // Precio al momento de la venta
      subtotal: { type: Number, required: true }
    }
  ],

  subtotal: { type: Number, required: true },
  iva: { type: Number, required: true }, // 13% en El Salvador
  total: { type: Number, required: true },
  
  metodoPago: { type: String, default: "efectivo" },
  numeroTicket: { type: String, required: true, unique: true }
}, {
  timestamps: true // Esto crea 'createdAt' automáticamente
});

// Le agregamos un tercer parámetro para forzar un nombre nuevo en la base de datos
const Venta = mongoose.model("Venta", ventaSchema, "registro_ventas");
export default Venta;