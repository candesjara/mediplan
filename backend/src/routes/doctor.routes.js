import express from "express";
import { obtenerDoctores, crearDoctor } from "../controllers/doctor.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerDoctores);
router.post("/", crearDoctor);

router.get("/protegida", verificarToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.usuario.correo}`, rol: req.usuario.rol });
});

export default router;
