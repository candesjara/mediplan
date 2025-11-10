import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: "4h" }
  );
};

// 📘 Registro
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validar existencia previa
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente)
      return res.status(400).json({ message: "El correo ya está registrado." });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: hash,
      rol,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};

// 📘 Login
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const valido = bcrypt.compareSync(password, usuario.password);
    if (!valido)
      return res.status(401).json({ message: "Contraseña incorrecta." });

    const token = generarToken(usuario);

    res.json({
      message: "Login exitoso.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};
