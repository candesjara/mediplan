import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import bcrypt from "bcryptjs";
import authRoutes from "../../../src/routes/auth.routes.js";
import { Usuario } from "../../../src/models/Usuario.js";

describe("auth routes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("POST /api/auth/login login exitoso", async () => {
    process.env.JWT_SECRET = "test-secret";
    const hash = bcrypt.hashSync("123456", 10);

    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: 1,
      nombre: "Admin",
      correo: "admin@test.com",
      rol: "admin",
      password: hash
    });

    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ correo: "admin@test.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /api/auth/login retorna 404 si usuario no existe", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ correo: "no@test.com", password: "123456" });

    expect(res.status).toBe(404);
  });

  test("POST /api/auth/login retorna 401 si password es incorrecto", async () => {
    const hash = bcrypt.hashSync("correcta", 10);
    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: 1,
      nombre: "Admin",
      correo: "admin@test.com",
      rol: "admin",
      password: hash
    });

    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ correo: "admin@test.com", password: "incorrecta" });

    expect(res.status).toBe(401);
  });

  test("POST /api/auth/register retorna 400 si correo duplicado", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue({ id: 10, correo: "dup@test.com" });

    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ nombre: "Ana", correo: "dup@test.com", password: "123", rol: "admin" });

    expect(res.status).toBe(400);
  });

  test("POST /api/auth/register retorna 500 si create falla", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    jest.spyOn(Usuario, "create").mockRejectedValue(new Error("db error"));

    const app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ nombre: "Ana", correo: "ana@test.com", password: "123", rol: "admin" });

    expect(res.status).toBe(500);
  });
});
