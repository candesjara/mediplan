import express from "express";
import { obtenerDoctores, crearDoctor, eliminarDoctor } from "../controllers/doctor.controller.js";
import { verificarToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerDoctores);
router.post("/", verificarToken, requireRole("admin"), crearDoctor);
router.delete("/:id", verificarToken, requireRole("admin"), eliminarDoctor);

router.get("/protegida", verificarToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.usuario.correo}`, rol: req.usuario.rol });
});

export default router;
