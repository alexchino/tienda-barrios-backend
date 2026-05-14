import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/productos",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombre);
  },
});

export const uploadProducto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
