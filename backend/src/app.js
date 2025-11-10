import express from "express";
import cors from "cors";
import { conectarDB, sequelize } from "./config/database.js";
import doctorRoutes from "./routes/doctor.routes.js";
import authRoutes from "./routes/auth.routes.js";
import pacienteRoutes from "./routes/paciente.routes.js";
import citaRoutes from "./routes/cita.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/doctores", doctorRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/citas", citaRoutes);

// Base de datos
await conectarDB();
await sequelize.sync({ alter: true });

export default app;
