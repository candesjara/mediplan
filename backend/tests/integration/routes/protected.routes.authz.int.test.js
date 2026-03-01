import { jest } from "@jest/globals";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import pacienteRoutes from "../../../src/routes/paciente.routes.js";
import citaRoutes from "../../../src/routes/cita.routes.js";
import doctorRoutes from "../../../src/routes/doctor.routes.js";
import { Paciente } from "../../../src/models/Paciente.js";
import { Cita } from "../../../src/models/Cita.js";

describe("protected routes auth scenarios", () => {
  test("GET /api/pacientes responde 403 sin token", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/pacientes", pacienteRoutes);

    const res = await request(app).get("/api/pacientes");

    expect(res.status).toBe(403);
  });

  test("GET /api/citas responde 403 con formato de token invalido", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/citas", citaRoutes);

    const res = await request(app)
      .get("/api/citas")
      .set("Authorization", "Bearer");

    expect(res.status).toBe(403);
  });

  test("GET /api/pacientes responde 401 con token invalido", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/pacientes", pacienteRoutes);

    const res = await request(app)
      .get("/api/pacientes")
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).toBe(401);
  });

  test("GET /api/pacientes responde 500 cuando el modelo lanza excepcion", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);
    jest.spyOn(Paciente, "findAll").mockRejectedValue(new Error("db error"));

    const app = express();
    app.use(express.json());
    app.use("/api/pacientes", pacienteRoutes);

    const res = await request(app)
      .get("/api/pacientes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });

  test("GET /api/citas responde 500 cuando el modelo lanza excepcion", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);
    jest.spyOn(Cita, "findAll").mockRejectedValue(new Error("db error"));

    const app = express();
    app.use(express.json());
    app.use("/api/citas", citaRoutes);

    const res = await request(app)
      .get("/api/citas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });

  test("GET /api/doctores/protegida responde 200 con token valido", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    app.use("/api/doctores", doctorRoutes);

    const res = await request(app)
      .get("/api/doctores/protegida")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.rol).toBe("admin");
  });

  test("POST /api/doctores responde 403 con rol no admin", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "doctor@test.com", rol: "doctor" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    app.use("/api/doctores", doctorRoutes);

    const res = await request(app)
      .post("/api/doctores")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Dr. Demo", especialidad: "Pediatria", correo: "demo@test.com" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/No autorizado/i);
  });

  test("POST /api/pacientes responde 403 con rol no admin", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "doctor@test.com", rol: "doctor" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    app.use("/api/pacientes", pacienteRoutes);

    const res = await request(app)
      .post("/api/pacientes")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Ana", documento: "9001", correo: "ana@test.com" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/No autorizado/i);
  });

  test("PUT /api/citas/:id responde 403 con rol no admin", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: 1, correo: "doctor@test.com", rol: "doctor" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    app.use("/api/citas", citaRoutes);

    const res = await request(app)
      .put("/api/citas/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ estado: "confirmada" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/No autorizado/i);
  });
});
