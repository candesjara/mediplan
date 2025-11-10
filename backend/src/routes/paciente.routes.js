import express from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { obtenerPacientes, crearPaciente, actualizarPaciente, eliminarPaciente } from "../controllers/paciente.controller.js";

const router = express.Router();

// Solo accesibles con token
router.get("/", verificarToken, obtenerPacientes);
router.post("/", verificarToken, crearPaciente);
router.put("/:id", verificarToken, actualizarPaciente);
router.delete("/:id", verificarToken, eliminarPaciente);

export default router;
