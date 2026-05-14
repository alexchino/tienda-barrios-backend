import { Schema, model } from 'mongoose';

const proveedorSchema = new Schema({
  nombreEmpresa: { 
    type: String, 
    required: [true, 'El nombre de la empresa es obligatorio'],
    trim: true 
  },
  nombreContacto: { 
    type: String,
    trim: true 
  },
  telefono: { 
    type: String,
    trim: true 
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true 
  },
  direccion: { 
    type: String 
  },
  estado: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

const Proveedor = model('Proveedor', proveedorSchema);
export default Proveedor;