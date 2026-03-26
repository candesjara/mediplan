import express from "express";
import { verificarToken, requireRole } from "../middlewares/auth.middleware.js";
import {
  obtenerCitas,
  crearCita,
  crearCitaPublica,
  actualizarCita,
  eliminarCita,
} from "../controllers/cita.controller.js";

const router = express.Router();

router.post("/publica", crearCitaPublica);
router.get("/", verificarToken, obtenerCitas);
router.post("/", verificarToken, crearCita);
router.put("/:id", verificarToken, requireRole("admin"), actualizarCita);
router.delete("/:id", verificarToken, eliminarCita);

export default router;
