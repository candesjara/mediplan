import { Paciente } from "../models/Paciente.js";

// ✅ Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.findAll();
  res.json(pacientes);
};

// ✅ Crear nuevo paciente
export const crearPaciente = async (req, res) => {
  try {
    const { documento, correo } = req.body;

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

    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);

  } catch (error) {
    res.status(400).json({
      message: "Error al crear paciente.",
      error: error.message,
    });
  }
};

// ✅ Actualizar paciente
export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await Paciente.update(req.body, { where: { id } });
    res.json({ message: "Paciente actualizado" });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar paciente", error });
  }
};

// ✅ Eliminar paciente
export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await Paciente.destroy({ where: { id } });
    res.json({ message: "Paciente eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar paciente", error });
  }
};
