import dotenv from "dotenv";
dotenv.config();

export const config = {
  db: {
    // Cambiamos DATABASE_URL por MONGO_URI (más común en Mongo)
    // O puedes dejarlo como DATABASE_URL siempre que en tu .env pongas la de Atlas
    connectionString: process.env.MONGO_URI || process.env.DATABASE_URL,
  },
  app: {
    port: process.env.PORT || 5000,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.TOKEN_EXPIRES,
  }
};