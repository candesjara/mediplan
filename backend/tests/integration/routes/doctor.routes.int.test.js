import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import doctorRoutes from "../../../src/routes/doctor.routes.js";
import { Doctor } from "../../../src/models/Doctor.js";

describe("GET /api/doctores", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("listado de doctores", async () => {
    jest.spyOn(Doctor, "findAll").mockResolvedValue([
      { id: 1, nombre: "Dr. Ruiz", especialidad: "Pediatria", correo: "ruiz@test.com" }
    ]);

    const app = express();
    app.use(express.json());
    app.use("/api/doctores", doctorRoutes);

    const res = await request(app).get("/api/doctores");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].nombre).toBe("Dr. Ruiz");
  });
});
