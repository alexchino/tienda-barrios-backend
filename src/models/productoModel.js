import { Schema, model } from 'mongoose';

const productoSchema = new Schema({
  // En Mongo, el ID se crea solo como _id, no necesitas definirlo aquí
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true 
  },
  precio: { 
    type: Schema.Types.Decimal128, // Formato correcto para dinero en Atlas
    required: true,
    get: (v) => parseFloat(v.toString()) // Para que cuando lo leas sea un número
  },
  stock: { 
    type: Number, 
    required: true,
    min: [0, 'El stock no puede ser negativo'],
    set: (v) => Math.round(v) // Asegura que sea entero como tenías en tu clase
  },
  categoria_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Categoria', // Esto hace la "conexión" con la otra tabla
    required: true 
  },
  // 👇 ¡NUEVO CAMPO AGREGADO AQUÍ! 👇
  proveedor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Proveedor', // Esta referencia debe coincidir con el nombre que le des al modelo de Proveedor
    required: [true, 'El proveedor es obligatorio'] // Cambia a false si prefieres que sea opcional por ahora
  },
  imagen: { 
    type: String,
    default: null
  },
  // En tu schema de Producto.js, agrega:
codigo_barras: {
  type: String,
  required: false, // Falso porque no todos los repuestos/productos tienen código
  trim: true
}

}, { 
  timestamps: true, // Crea automáticamente 'createdAt' y 'updatedAt'
  toJSON: { getters: true } // Aplica el parseFloat al precio al enviar a JSON
});

const Producto = model('Producto', productoSchema);
export default Producto; // Exportamos el modelo para usarlo en los controladores