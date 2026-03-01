import { Cita } from "../models/Cita.js";
import { Doctor } from "../models/Doctor.js";
import { Paciente } from "../models/Paciente.js";
import { Op } from "sequelize";

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada"];
const handleServerError = (res, error) => {
  const payload = { message: "Error interno del servidor" };
  if (process.env.NODE_ENV === "development") {
    payload.detail = error.message;
  }
  return res.status(500).json(payload);
};

// ✅ Obtener todas las citas (solo admin)
export const obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        { model: Doctor, attributes: ["nombre", "especialidad"] },
        { model: Paciente, attributes: ["nombre", "correo"] },
      ],
    });
    res.json(citas);
  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Crear una cita
export const crearCita = async (req, res) => {
  try {
    const { fecha, estado, doctor_id, paciente_id } = req.body;

    // Reglas de negocio para evitar citas inconsistentes
    if (!fecha || !doctor_id || !paciente_id) {
      return res.status(400).json({
        message: "La cita requiere fecha, doctor y paciente.",
      });
    }

    const fechaCita = new Date(fecha);
    if (Number.isNaN(fechaCita.getTime())) {
      return res.status(400).json({ message: "La fecha de la cita no es valida." });
    }

    if (fechaCita <= new Date()) {
      return res.status(400).json({ message: "La cita debe programarse en una fecha futura." });
    }

    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: "El estado de la cita no es valido." });
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(400).json({ message: "El doctor seleccionado no existe." });
    }

    const paciente = await Paciente.findByPk(paciente_id);
    if (!paciente) {
      return res.status(400).json({ message: "El paciente seleccionado no existe." });
    }

    const choqueDoctor = await Cita.findOne({
      where: {
        doctor_id,
        fecha: fechaCita,
        estado: { [Op.in]: ["pendiente", "confirmada"] },
      },
    });

    if (choqueDoctor) {
      return res.status(400).json({
        message: "El doctor ya tiene una cita activa en ese horario.",
      });
    }

    const choquePaciente = await Cita.findOne({
      where: {
        paciente_id,
        fecha: fechaCita,
        estado: { [Op.in]: ["pendiente", "confirmada"] },
      },
    });

    if (choquePaciente) {
      return res.status(400).json({
        message: "El paciente ya tiene una cita activa en ese horario.",
      });
    }

    const nuevaCita = await Cita.create({
      fecha: fechaCita,
      estado,
      doctor_id,
      paciente_id,
    });

    res.status(201).json(nuevaCita);
  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Actualizar una cita
export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, estado, doctor_id, paciente_id } = req.body;

    const citaActual = await Cita.findByPk(id);
    if (!citaActual) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }

    if (citaActual.estado === "cancelada" && estado && estado !== "cancelada") {
      return res.status(400).json({
        message: "Una cita cancelada no puede reactivarse.",
      });
    }

    let fechaFinal = citaActual.fecha;
    if (fecha !== undefined) {
      const fechaNueva = new Date(fecha);
      if (Number.isNaN(fechaNueva.getTime())) {
        return res.status(400).json({ message: "La fecha de la cita no es valida." });
      }
      if (fechaNueva <= new Date()) {
        return res.status(400).json({ message: "La cita debe programarse en una fecha futura." });
      }
      fechaFinal = fechaNueva;
    }

    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: "El estado de la cita no es valido." });
    }

    const doctorFinal = doctor_id ?? citaActual.doctor_id;
    const pacienteFinal = paciente_id ?? citaActual.paciente_id;
    const estadoFinal = estado ?? citaActual.estado;

    if (doctor_id !== undefined) {
      const doctor = await Doctor.findByPk(doctorFinal);
      if (!doctor) {
        return res.status(400).json({ message: "El doctor seleccionado no existe." });
      }
    }

    if (paciente_id !== undefined) {
      const paciente = await Paciente.findByPk(pacienteFinal);
      if (!paciente) {
        return res.status(400).json({ message: "El paciente seleccionado no existe." });
      }
    }

    if (estadoFinal !== "cancelada") {
      const choqueDoctor = await Cita.findOne({
        where: {
          id: { [Op.ne]: id },
          doctor_id: doctorFinal,
          fecha: fechaFinal,
          estado: { [Op.in]: ["pendiente", "confirmada"] },
        },
      });

      if (choqueDoctor) {
        return res.status(400).json({
          message: "El doctor ya tiene una cita activa en ese horario.",
        });
      }

      const choquePaciente = await Cita.findOne({
        where: {
          id: { [Op.ne]: id },
          paciente_id: pacienteFinal,
          fecha: fechaFinal,
          estado: { [Op.in]: ["pendiente", "confirmada"] },
        },
      });

      if (choquePaciente) {
        return res.status(400).json({
          message: "El paciente ya tiene una cita activa en ese horario.",
        });
      }
    }

    await Cita.update(req.body, { where: { id } });
    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// ✅ Eliminar cita
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    await Cita.destroy({ where: { id } });
    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    return handleServerError(res, error);
  }
};
