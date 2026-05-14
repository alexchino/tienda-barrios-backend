import { Usuario } from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcryptjs";

// ✅ LOGIN: Compara lo que escribe el usuario con el Hash de Atlas
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo: correo.trim() }).select("+contrasena");

    if (!usuario) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    const coinciden = await bcrypt.compare(password, usuario.contrasena);
    if (!coinciden) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expires }
    );

    res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// ✅ REGISTRO: Solo pasamos los datos, el Modelo encripta
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contrasena: password, // Pasamos el password limpio
      rol
    });

    await nuevoUsuario.save(); // Aquí se dispara el middleware del modelo
    res.status(201).json({ mensaje: "✨ Usuario creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear", detalle: error.message });
  }
};

// ... exportar las demás funciones (obtenerUsuarios, eliminarUsuario, etc.)
/**
 * ✅ OBTENER USUARIOS (La que te daba el error)
 */
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

/**
 * ✅ ACTUALIZAR USUARIO
 */
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, rol } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    if (nombre) usuario.nombre = nombre;
    if (correo) usuario.correo = correo;
    if (rol) usuario.rol = rol;
    if (password) usuario.contrasena = password;

    await usuario.save();
    return res.json({ mensaje: "✅ Usuario actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar" });
  }
};

/**
 * ✅ ELIMINAR USUARIO
 */
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    return res.json({ mensaje: "🗑️ Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar" });
  }
};