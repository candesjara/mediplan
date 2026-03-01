import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import citaRoutes from "../../../src/routes/cita.routes.js";
import { Cita } from "../../../src/models/Cita.js";

describe("GET /api/citas", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("listado de citas", async () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);

    jest.spyOn(Cita, "findAll").mockResolvedValue([
      {
        id: 1,
        fecha: "2026-02-01T10:00:00.000Z",
        estado: "pendiente",
        Doctor: { nombre: "Dr. Ruiz", especialidad: "Pediatria" },
        Paciente: { nombre: "Ana", correo: "ana@test.com" }
      }
    ]);

    const app = express();
    app.use(express.json());
    app.use("/api/citas", citaRoutes);

    const res = await request(app)
      .get("/api/citas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].estado).toBe("pendiente");
  });
});
