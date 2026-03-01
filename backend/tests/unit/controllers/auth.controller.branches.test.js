import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import { registrarUsuario, loginUsuario } from "../../../src/controllers/auth.controller.js";
import { Usuario } from "../../../src/models/Usuario.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("auth controller branches", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("registrarUsuario retorna 400 cuando el correo ya existe", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue({ id: 9, correo: "dup@test.com" });
    const req = { body: { nombre: "Ana", correo: "dup@test.com", password: "123", rol: "admin" } };
    const res = crearRes();

    await registrarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/^El correo/) }));
  });

  test("registrarUsuario retorna 201 cuando el registro es exitoso", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    jest.spyOn(Usuario, "create").mockResolvedValue({
      id: 1,
      nombre: "Ana",
      correo: "ana@test.com",
      rol: "admin"
    });

    const req = { body: { nombre: "Ana", correo: "ana@test.com", password: "123", rol: "admin" } };
    const res = crearRes();

    await registrarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/^Usuario registrado/) }));
  });

  test("loginUsuario retorna 404 cuando no existe usuario", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    const req = { body: { correo: "noexiste@test.com", password: "123" } };
    const res = crearRes();

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/^Usuario no encontrado/) }));
  });

  test("loginUsuario retorna 401 cuando la contraseña es incorrecta", async () => {
    const hash = bcrypt.hashSync("correcta", 10);
    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: 1,
      nombre: "Ana",
      correo: "ana@test.com",
      rol: "admin",
      password: hash
    });

    const req = { body: { correo: "ana@test.com", password: "mala" } };
    const res = crearRes();

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/^Contrase/) }));
  });
});
