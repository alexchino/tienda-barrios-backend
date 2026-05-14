import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true 
  },
  correo: { 
    type: String, 
    required: [true, 'El correo es obligatorio'],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  contrasena: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'],
    select: false // Seguridad: no se incluye en los find() normales
  },
  rol: { 
    type: String, 
    enum: ['admin', 'vendedor'], 
    default: 'vendedor' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// ✅ MIDDLEWARE CORREGIDO: Sin el parámetro 'next'
usuarioSchema.pre('save', async function() {
  // Solo encripta si la contraseña cambió o es nueva
  if (!this.isModified('contrasena')) return;

  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  // En funciones async de Mongoose, no necesitas llamar a next()
});

export const Usuario = model('Usuario', usuarioSchema);