import { jest } from "@jest/globals";
import { crearDoctor, obtenerDoctores } from "../../../src/controllers/doctor.controller.js";
import { Doctor } from "../../../src/models/Doctor.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("doctor controller branches", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("obtenerDoctores responde lista", async () => {
    jest.spyOn(Doctor, "findAll").mockResolvedValue([{ id: 1, nombre: "Dr. Ruiz" }]);
    const res = crearRes();

    await obtenerDoctores({}, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: "Dr. Ruiz" }]);
  });

  test("crearDoctor retorna 400 cuando el nombre es corto", async () => {
    const req = { body: { nombre: "Al", especialidad: "Pediatria", correo: "doc@test.com" } };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("nombre del doctor") })
    );
  });

  test("crearDoctor retorna 400 cuando el correo es invalido", async () => {
    const req = { body: { nombre: "Dr. Ruiz", especialidad: "Pediatria", correo: "correo-invalido" } };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("correo del doctor") })
    );
  });

  test("crearDoctor retorna 400 cuando el telefono no cumple formato", async () => {
    const req = { body: { nombre: "Dr. Ruiz", especialidad: "Pediatria", correo: "doc@test.com", telefono: "12A4" } };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("telefono del doctor") })
    );
  });

  test("crearDoctor retorna 400 cuando el correo ya existe", async () => {
    jest.spyOn(Doctor, "findOne").mockResolvedValue({ id: 9, correo: "doc@test.com" });
    const req = { body: { nombre: "Dr. Ruiz", especialidad: "Pediatria", correo: "doc@test.com" } };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Ya existe un doctor") })
    );
  });

  test("crearDoctor responde 201 cuando pasa reglas de validacion", async () => {
    jest.spyOn(Doctor, "findOne").mockResolvedValue(null);
    jest.spyOn(Doctor, "create").mockResolvedValue({
      id: 1,
      nombre: "Dr. Ruiz",
      especialidad: "Pediatria",
      correo: "doc@test.com"
    });
    const req = {
      body: { nombre: "Dr. Ruiz", especialidad: "Pediatria", correo: "doc@test.com", telefono: "3001234" }
    };
    const res = crearRes();

    await crearDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nombre: "Dr. Ruiz" }));
  });
});
