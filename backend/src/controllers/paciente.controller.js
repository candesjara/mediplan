import { Paciente } from "../models/Paciente.js";
import { Cita } from "../models/Cita.js";
import { Op } from "sequelize";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{3,15}$/;
const documentoRegex = /^\d{3,15}$/;
const handleServerError = (res, error) => {
  const payload = { message: "Error interno del servidor" };
  if (process.env.NODE_ENV === "development") {
    payload.detail = error.message;
  }
  return res.status(500).json(payload);
};

// ✅ Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Crear nuevo paciente
export const crearPaciente = async (req, res) => {
  try {
    const { nombre, documento, correo, telefono } = req.body;

    // Reglas de negocio basicas para alta de pacientes
    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3) {
      return res.status(400).json({ message: "El nombre del paciente debe tener al menos 3 caracteres." });
    }

    if (!documento || !documentoRegex.test(documento)) {
      return res.status(400).json({ message: "El documento es obligatorio y debe tener entre 3 y 15 digitos." });
    }

    if (correo && !emailRegex.test(correo)) {
      return res.status(400).json({ message: "El correo del paciente no tiene un formato valido." });
    }

    if (telefono && !phoneRegex.test(telefono)) {
      return res.status(400).json({ message: "El telefono del paciente debe contener entre 3 y 15 digitos." });
    }

    // ✅ Validar duplicados antes de crear
    const existe = await Paciente.findOne({ where: { documento } });
    if (existe)
      return res.status(400).json({
        message: `Ya existe un paciente con el documento ${documento}.`,
      });

    const existeCorreo = await Paciente.findOne({ where: { correo } });
    if (existeCorreo)
      return res.status(400).json({
        message: `Ya existe un paciente registrado con el correo ${correo}.`,
      });

    const paciente = await Paciente.create({
      nombre: nombre.trim(),
      documento,
      telefono: telefono || null,
      correo: correo || null,
    });
    res.status(201).json(paciente);

  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Actualizar paciente
export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, documento, correo, telefono } = req.body;

    const pacienteActual = await Paciente.findByPk(id);
    if (!pacienteActual) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim().length < 3)) {
      return res.status(400).json({ message: "El nombre del paciente debe tener al menos 3 caracteres." });
    }

    if (documento !== undefined) {
      if (!documentoRegex.test(documento)) {
        return res.status(400).json({ message: "El documento debe tener entre 3 y 15 digitos." });
      }

      const existeDocumento = await Paciente.findOne({
        where: { documento, id: { [Op.ne]: id } },
      });

      if (existeDocumento) {
        return res.status(400).json({
          message: `Otro paciente ya usa el documento ${documento}.`,
        });
      }
    }

    if (correo !== undefined && correo !== null && correo !== "") {
      if (!emailRegex.test(correo)) {
        return res.status(400).json({ message: "El correo del paciente no tiene un formato valido." });
      }

      const existeCorreo = await Paciente.findOne({
        where: { correo, id: { [Op.ne]: id } },
      });

      if (existeCorreo) {
        return res.status(400).json({
          message: `Otro paciente ya usa el correo ${correo}.`,
        });
      }
    }

    if (telefono !== undefined && telefono !== null && telefono !== "" && !phoneRegex.test(telefono)) {
      return res.status(400).json({ message: "El telefono del paciente debe contener entre 3 y 15 digitos." });
    }

    await Paciente.update(req.body, { where: { id } });
    res.json({ message: "Paciente actualizado" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Eliminar paciente
export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    // No se elimina si tiene citas activas para evitar perdida funcional
    const citasActivas = await Cita.count({
      where: {
        paciente_id: id,
        estado: { [Op.in]: ["pendiente", "confirmada"] },
      },
    });

    if (citasActivas > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el paciente porque tiene citas activas.",
      });
    }

    const eliminados = await Paciente.destroy({ where: { id } });
    if (!eliminados) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    res.json({ message: "Paciente eliminado" });
  } catch (error) {
    return handleServerError(res, error);
  }
};
