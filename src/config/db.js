import mongoose from 'mongoose';
import { config } from "./config.js";

export const getConnection = async () => {
  try {
    // serverSelectionTimeoutMS evita que el servidor se quede colgado si falla el internet
    await mongoose.connect(config.db.connectionString, {
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log("-----------------------------------------");
    console.log("✅ Conexión a MongoDB Atlas exitosa");
    console.log("-----------------------------------------");
    
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB Atlas:", error.message);
    // Si sale error aquí, revisa que tus DNS en Windows sean 8.8.8.8
    throw error;
  }
};

// Exportamos pool para mantener compatibilidad con controladores SQL
export const pool = {
  query: () => console.warn("⚠️ Advertencia: Estás intentando ejecutar una consulta SQL en MongoDB.")
};

export { mongoose };