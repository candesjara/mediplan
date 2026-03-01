import { jest } from "@jest/globals";
import { crearDoctor } from "../../../src/controllers/doctor.controller.js";
import { obtenerCitas } from "../../../src/controllers/cita.controller.js";
import { loginUsuario } from "../../../src/controllers/auth.controller.js";
import { Doctor } from "../../../src/models/Doctor.js";
import { Cita } from "../../../src/models/Cita.js";
import { Usuario } from "../../../src/models/Usuario.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("Controller error flows", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("crearDoctor retorna 500 cuando falla create", async () => {
    jest.spyOn(Doctor, "findOne").mockResolvedValue(null);
    jest.spyOn(Doctor, "create").mockRejectedValue(new Error("db error"));
    const req = {
      body: {
        nombre: "Dr. Test",
        especialidad: "Medicina General",
        correo: "doctor@test.com",
        telefono: "3001234"
      }
    };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error interno del servidor" })
    );
  });

  test("obtenerCitas retorna 500 cuando falla findAll", async () => {
    jest.spyOn(Cita, "findAll").mockRejectedValue(new Error("db error"));
    const req = {};
    const res = crearRes();

    await obtenerCitas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error interno del servidor" })
    );
  });

  test("loginUsuario retorna 500 cuando falla consulta de usuario", async () => {
    jest.spyOn(Usuario, "findOne").mockRejectedValue(new Error("db error"));
    const req = { body: { correo: "a@a.com", password: "123" } };
    const res = crearRes();

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error interno del servidor" })
    );
  });
});
