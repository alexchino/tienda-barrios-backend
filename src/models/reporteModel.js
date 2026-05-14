import { Schema, model } from 'mongoose';

const reporteSchema = new Schema({
  tipoReporte: { 
    type: String, 
    enum: ['diario', 'mensual', 'anual'], 
    required: true 
  },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  totalVendido: { type: Schema.Types.Decimal128, required: true },
  cantidadVentas: { type: Number, required: true },
  
  // Guardamos el producto estrella del periodo
  productoMasVendido: {
    nombre: String,
    cantidad: Number
  },
  
  generadoPor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario' // Quién hizo el cierre de caja
  }
}, { timestamps: true });

export const Reporte = model('Reporte', reporteSchema);