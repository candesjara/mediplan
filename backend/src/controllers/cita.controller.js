import { Cita } from "../models/Cita.js";
import { Doctor } from "../models/Doctor.js";
import { Paciente } from "../models/Paciente.js";

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
    res.status(500).json({ message: "Error al obtener citas", error });
  }
};

// ✅ Crear una cita
export const crearCita = async (req, res) => {
  try {
    const { fecha, estado, doctor_id, paciente_id } = req.body;
    const nuevaCita = await Cita.create({ fecha, estado, doctor_id, paciente_id });
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(400).json({ message: "Error al crear cita", error });
  }
};

// ✅ Actualizar una cita
export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    await Cita.update(req.body, { where: { id } });
    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar cita", error });
  }
};

// ✅ Eliminar cita
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    await Cita.destroy({ where: { id } });
    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar cita", error });
  }
};
