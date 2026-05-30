import { Usuario } from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcryptjs";

// ✅ LOGIN: Ahora permite iniciar sesión con Correo O con Nombre de Usuario (ej: caja1)
export const loginUsuario = async (req, res) => {
  try {
    // 1. Recibimos 'identificador' que envía el nuevo frontend
    const { identificador, password } = req.body;

    if (!identificador || !password) {
      return res.status(400).json({ mensaje: "Por favor ingresa usuario y contraseña" });
    }

    const valorLimpio = identificador.trim();

    // 2. Buscamos en Atlas si coincide con el correo o con el nombre (ignorando mayúsculas)
    const usuario = await Usuario.findOne({
      $or: [
        { correo: valorLimpio },
        { nombre: new RegExp(`^${valorLimpio}$`, 'i') } 
      ]
    }).select("+contrasena");

    if (!usuario) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    // 3. Comparamos contraseñas
    const coinciden = await bcrypt.compare(password, usuario.contrasena);
    if (!coinciden) return res.status(401).json({ mensaje: "Credenciales inválidas" });

    // 4. Generamos token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expires }
    );

    res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
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

/**
 * ✅ OBTENER USUARIOS
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