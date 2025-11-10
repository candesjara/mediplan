import express from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { obtenerCitas, crearCita, actualizarCita, eliminarCita } from "../controllers/cita.controller.js";

const router = express.Router();

router.get("/", verificarToken, obtenerCitas);
router.post("/", verificarToken, crearCita);
router.put("/:id", verificarToken, actualizarCita);
router.delete("/:id", verificarToken, eliminarCita);

export default router;
