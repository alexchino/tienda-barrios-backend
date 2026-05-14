import { Schema, model } from 'mongoose';

const clienteSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String },
  correo: { type: String }
}, { timestamps: true });

const Cliente = model('Cliente', clienteSchema);
export default Cliente; // Exportamos el modelo para usarlo en los controladores