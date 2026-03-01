import { jest } from "@jest/globals";
import { crearCita, actualizarCita, eliminarCita } from "../../../src/controllers/cita.controller.js";
import { Cita } from "../../../src/models/Cita.js";
import { Doctor } from "../../../src/models/Doctor.js";
import { Paciente } from "../../../src/models/Paciente.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("cita controller branches", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("crearCita responde 201 cuando cumple reglas de negocio", async () => {
    const fechaFutura = "2099-01-01T10:00:00.000Z";
    jest.spyOn(Doctor, "findByPk").mockResolvedValue({ id: 1, nombre: "Dr. Ruiz" });
    jest.spyOn(Paciente, "findByPk").mockResolvedValue({ id: 1, nombre: "Ana" });
    jest.spyOn(Cita, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    jest.spyOn(Cita, "create").mockResolvedValue({ id: 1, estado: "pendiente" });
    const req = { body: { fecha: fechaFutura, estado: "pendiente", doctor_id: 1, paciente_id: 1 } };
    const res = crearRes();

    await crearCita(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  test("crearCita responde 400 cuando la fecha es pasada", async () => {
    const req = { body: { fecha: "2020-01-01T10:00:00.000Z", estado: "pendiente", doctor_id: 1, paciente_id: 1 } };
    const res = crearRes();

    await crearCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("fecha futura") })
    );
  });

  test("crearCita responde 400 cuando el doctor no existe", async () => {
    const fechaFutura = "2099-01-01T10:00:00.000Z";
    jest.spyOn(Doctor, "findByPk").mockResolvedValue(null);
    const req = { body: { fecha: fechaFutura, estado: "pendiente", doctor_id: 99, paciente_id: 1 } };
    const res = crearRes();

    await crearCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("doctor seleccionado no existe") })
    );
  });

  test("crearCita responde 400 cuando el doctor ya tiene cita en el mismo horario", async () => {
    const fechaFutura = "2099-01-01T10:00:00.000Z";
    jest.spyOn(Doctor, "findByPk").mockResolvedValue({ id: 1, nombre: "Dr. Ruiz" });
    jest.spyOn(Paciente, "findByPk").mockResolvedValue({ id: 1, nombre: "Ana" });
    jest.spyOn(Cita, "findOne").mockResolvedValueOnce({ id: 7, doctor_id: 1 });
    const req = { body: { fecha: fechaFutura, estado: "pendiente", doctor_id: 1, paciente_id: 1 } };
    const res = crearRes();

    await crearCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("doctor ya tiene una cita activa") })
    );
  });

  test("actualizarCita responde ok", async () => {
    jest.spyOn(Cita, "findByPk").mockResolvedValue({
      id: 1,
      fecha: new Date("2099-01-01T10:00:00.000Z"),
      doctor_id: 1,
      paciente_id: 1,
      estado: "pendiente"
    });
    jest.spyOn(Cita, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    jest.spyOn(Cita, "update").mockResolvedValue([1]);
    const req = { params: { id: "1" }, body: { estado: "confirmada" } };
    const res = crearRes();

    await actualizarCita(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Cita actualizada correctamente" });
  });

  test("actualizarCita responde 400 cuando se intenta reactivar una cita cancelada", async () => {
    jest.spyOn(Cita, "findByPk").mockResolvedValue({
      id: 1,
      fecha: new Date("2099-01-01T10:00:00.000Z"),
      doctor_id: 1,
      paciente_id: 1,
      estado: "cancelada"
    });
    const req = { params: { id: "1" }, body: { estado: "confirmada" } };
    const res = crearRes();

    await actualizarCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("no puede reactivarse") })
    );
  });

  test("actualizarCita responde 400 cuando update falla", async () => {
    jest.spyOn(Cita, "findByPk").mockResolvedValue({
      id: 1,
      fecha: new Date("2099-01-01T10:00:00.000Z"),
      doctor_id: 1,
      paciente_id: 1,
      estado: "pendiente"
    });
    jest.spyOn(Cita, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    jest.spyOn(Cita, "update").mockRejectedValue(new Error("db error"));
    const req = { params: { id: "1" }, body: { estado: "confirmada" } };
    const res = crearRes();

    await actualizarCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al actualizar cita" }));
  });

  test("eliminarCita responde ok", async () => {
    jest.spyOn(Cita, "destroy").mockResolvedValue(1);
    const req = { params: { id: "1" } };
    const res = crearRes();

    await eliminarCita(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Cita eliminada correctamente" });
  });

  test("eliminarCita responde 400 cuando destroy falla", async () => {
    jest.spyOn(Cita, "destroy").mockRejectedValue(new Error("db error"));
    const req = { params: { id: "1" } };
    const res = crearRes();

    await eliminarCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al eliminar cita" }));
  });
});
