import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import pacienteRoutes from "../../../src/routes/paciente.routes.js";
import { Paciente } from "../../../src/models/Paciente.js";

describe("POST /api/pacientes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("crea paciente cuando no hay duplicados", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);

    jest.spyOn(Paciente, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    jest.spyOn(Paciente, "create").mockResolvedValue({
      id: 10,
      nombre: "Ana",
      documento: "123",
      correo: "ana@test.com"
    });

    const app = express();
    app.use(express.json());
    app.use("/api/pacientes", pacienteRoutes);

    const res = await request(app)
      .post("/api/pacientes")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Ana", documento: "123", telefono: "300", correo: "ana@test.com" });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("Ana");
  });
});
