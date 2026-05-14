import { Router } from "express";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/login", loginUsuario);

export default router;
