import { Cita } from "../../../src/models/Cita.js";

describe("Cita model", () => {
  test("estado tiene valor por defecto pendiente", () => {
    const cita = Cita.build({
      fecha: new Date("2026-01-01T10:00:00Z"),
      doctor_id: 1,
      paciente_id: 1
    });

    expect(cita.estado).toBe("pendiente");
  });

  test("estado permite solo valores definidos", () => {
    const valores = Cita.getAttributes().estado.values;
    expect(valores).toEqual(["pendiente", "confirmada", "cancelada"]);
  });
});
