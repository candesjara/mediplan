import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { verificarToken } from "../../../src/middlewares/auth.middleware.js";

const crearRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("auth middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  test("retorna 403 si no hay authorization header", () => {
    const req = { headers: {} };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("retorna 403 si el formato del token es invalido", () => {
    const req = { headers: { authorization: "Bearer" } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("retorna 401 si token es invalido", () => {
    const req = { headers: { authorization: "Bearer token-invalido" } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("llama next y adjunta usuario si token es valido", () => {
    const token = jwt.sign({ correo: "admin@test.com", rol: "admin" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = crearRes();
    const next = jest.fn();

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.usuario.correo).toBe("admin@test.com");
  });
});
