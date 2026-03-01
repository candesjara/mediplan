import { Doctor } from "../models/Doctor.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{3,15}$/;

export const obtenerDoctores = async (req, res) => {
  try {
    const doctores = await Doctor.findAll();
    res.json(doctores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener doctores", error: error.message });
  }
};

export const crearDoctor = async (req, res) => {
  try {
    const { nombre, especialidad, telefono, correo } = req.body;

    // Reglas de negocio basicas para mantener datos consistentes
    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3) {
      return res.status(400).json({ message: "El nombre del doctor debe tener al menos 3 caracteres." });
    }

    if (!especialidad || typeof especialidad !== "string" || especialidad.trim().length < 3) {
      return res.status(400).json({ message: "La especialidad es obligatoria y debe tener al menos 3 caracteres." });
    }

    if (correo && !emailRegex.test(correo)) {
      return res.status(400).json({ message: "El correo del doctor no tiene un formato valido." });
    }

    if (telefono && !phoneRegex.test(telefono)) {
      return res.status(400).json({ message: "El telefono del doctor debe contener entre 3 y 15 digitos." });
    }

    if (correo) {
      const doctorConCorreo = await Doctor.findOne({ where: { correo } });
      if (doctorConCorreo) {
        return res.status(400).json({ message: `Ya existe un doctor registrado con el correo ${correo}.` });
      }
    }

    const doctor = await Doctor.create({
      nombre: nombre.trim(),
      especialidad: especialidad.trim(),
      telefono: telefono || null,
      correo: correo || null,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el doctor.", error: error.message });
  }
};
