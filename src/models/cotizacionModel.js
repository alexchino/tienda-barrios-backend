import { Schema, model } from 'mongoose';

const cotizacionSchema = new Schema({
  Nombre: { type: String, required: true },
  Apellido: { type: String },
  Correo: { type: String },
  Telefono: { type: String },
  productos: [{
    ProductID: { type: Schema.Types.ObjectId, ref: 'Producto' },
    Nombre: String,
    Cantidad: Number,
    PrecioUnitario: Number
  }],
  Subtotal: { type: Number, required: true },
  IVA: { type: Number, required: true },
  Total: { type: Number, required: true },
  estado: { type: String, default: 'Pendiente' } // Para seguimiento posterior
}, { timestamps: true });

export default model('Cotizacion', cotizacionSchema);