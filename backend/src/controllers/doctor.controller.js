import { Doctor } from "../models/Doctor.js";

export const obtenerDoctores = async (req, res) => {
  const doctores = await Doctor.findAll();
  res.json(doctores);
};

export const crearDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el doctor", error });
  }
};
