import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true 
  },
  descripcion: { 
    type: String,
    trim: true 
  }
}, { 
  timestamps: true,
  versionKey: false 
});

 const Categoria = model('Categoria', categoriaSchema);
  export default Categoria; // Exportamos el modelo para usarlo en los controladores