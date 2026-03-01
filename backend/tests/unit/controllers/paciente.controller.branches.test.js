import { jest } from "@jest/globals";
import {
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
  obtenerPacientes
} from "../../../src/controllers/paciente.controller.js";
import { Paciente } from "../../../src/models/Paciente.js";
import { Cita } from "../../../src/models/Cita.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("paciente controller branches", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("obtenerPacientes responde lista", async () => {
    jest.spyOn(Paciente, "findAll").mockResolvedValue([{ id: 1, nombre: "Ana" }]);
    const res = crearRes();

    await obtenerPacientes({}, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: "Ana" }]);
  });

  test("crearPaciente retorna 400 si documento ya existe", async () => {
    jest.spyOn(Paciente, "findOne").mockResolvedValueOnce({ id: 1, documento: "123" });
    const req = { body: { nombre: "Ana", documento: "123", correo: "ana@test.com" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("documento") }));
  });

  test("crearPaciente retorna 400 si correo ya existe", async () => {
    jest.spyOn(Paciente, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2, correo: "ana@test.com" });

    const req = { body: { nombre: "Ana", documento: "999", correo: "ana@test.com" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("correo") }));
  });

  test("crearPaciente retorna 400 cuando create falla", async () => {
    jest.spyOn(Paciente, "findOne").mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    jest.spyOn(Paciente, "create").mockRejectedValue(new Error("db error"));

    const req = { body: { nombre: "Ana", documento: "999", correo: "ana@test.com" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al crear paciente." }));
  });

  test("crearPaciente retorna 400 cuando el nombre es muy corto", async () => {
    const req = { body: { nombre: "Al", documento: "12345", correo: "ana@test.com" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("nombre del paciente") })
    );
  });

  test("crearPaciente retorna 400 cuando el documento no es valido", async () => {
    const req = { body: { nombre: "Ana", documento: "AB-1", correo: "ana@test.com" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("documento") })
    );
  });

  test("crearPaciente retorna 400 cuando el correo no es valido", async () => {
    const req = { body: { nombre: "Ana", documento: "12345", correo: "ana@correo" } };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("correo") })
    );
  });

  test("crearPaciente retorna 201 cuando pasa reglas de validacion", async () => {
    jest.spyOn(Paciente, "findOne").mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    jest.spyOn(Paciente, "create").mockResolvedValue({
      id: 1,
      nombre: "Ana Perez",
      documento: "12345",
      correo: "ana@test.com"
    });

    const req = {
      body: { nombre: "Ana Perez", documento: "12345", telefono: "3001234", correo: "ana@test.com" }
    };
    const res = crearRes();

    await crearPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nombre: "Ana Perez" }));
  });

  test("actualizarPaciente responde ok", async () => {
    jest.spyOn(Paciente, "findByPk").mockResolvedValue({ id: 1, nombre: "Ana" });
    jest.spyOn(Paciente, "update").mockResolvedValue([1]);
    const req = { params: { id: "1" }, body: { nombre: "Ana 2" } };
    const res = crearRes();

    await actualizarPaciente(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Paciente actualizado" });
  });

  test("actualizarPaciente retorna 404 cuando no existe el paciente", async () => {
    jest.spyOn(Paciente, "findByPk").mockResolvedValue(null);
    const req = { params: { id: "100" }, body: { nombre: "Ana 2" } };
    const res = crearRes();

    await actualizarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Paciente no encontrado." }));
  });

  test("actualizarPaciente retorna 400 cuando se repite el documento de otro paciente", async () => {
    jest.spyOn(Paciente, "findByPk").mockResolvedValue({ id: 1, nombre: "Ana" });
    jest.spyOn(Paciente, "findOne").mockResolvedValueOnce({ id: 2, documento: "88888" });

    const req = { params: { id: "1" }, body: { documento: "88888" } };
    const res = crearRes();

    await actualizarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("documento") })
    );
  });

  test("actualizarPaciente retorna 400 cuando update falla", async () => {
    jest.spyOn(Paciente, "findByPk").mockResolvedValue({ id: 1, nombre: "Ana" });
    jest.spyOn(Paciente, "update").mockRejectedValue(new Error("db error"));
    const req = { params: { id: "1" }, body: { nombre: "Ana 2" } };
    const res = crearRes();

    await actualizarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al actualizar paciente" }));
  });

  test("eliminarPaciente responde ok", async () => {
    jest.spyOn(Cita, "count").mockResolvedValue(0);
    jest.spyOn(Paciente, "destroy").mockResolvedValue(1);
    const req = { params: { id: "1" } };
    const res = crearRes();

    await eliminarPaciente(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Paciente eliminado" });
  });

  test("eliminarPaciente retorna 400 cuando tiene citas activas", async () => {
    jest.spyOn(Cita, "count").mockResolvedValue(2);
    const req = { params: { id: "1" } };
    const res = crearRes();

    await eliminarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("citas activas") })
    );
  });

  test("eliminarPaciente retorna 400 cuando destroy falla", async () => {
    jest.spyOn(Cita, "count").mockResolvedValue(0);
    jest.spyOn(Paciente, "destroy").mockRejectedValue(new Error("db error"));
    const req = { params: { id: "1" } };
    const res = crearRes();

    await eliminarPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al eliminar paciente" }));
  });
});
