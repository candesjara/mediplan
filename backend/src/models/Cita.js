import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Doctor } from "./Doctor.js";
import { Paciente } from "./Paciente.js";

export const Cita = sequelize.define(
  "Cita",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      defaultValue: "pendiente",
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      // Clave obligatoria: una cita siempre debe tener doctor asignado
      allowNull: false,
      references: {
        model: Doctor,
        key: "id",
      },
      // RESTRICT evita eliminar el doctor si tiene citas relacionadas
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      // Clave obligatoria: una cita siempre debe tener paciente asignado
      allowNull: false,
      references: {
        model: Paciente,
        key: "id",
      },
      // RESTRICT evita eliminar el paciente si tiene citas relacionadas
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "citas",
    timestamps: false,
  }
);

// Relaciones explícitas
Doctor.hasMany(Cita, {
  foreignKey: "doctor_id",
  // RESTRICT mantiene integridad referencial de citas existentes
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
Paciente.hasMany(Cita, {
  foreignKey: "paciente_id",
  // RESTRICT mantiene integridad referencial de citas existentes
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
Cita.belongsTo(Doctor, { foreignKey: "doctor_id" });
Cita.belongsTo(Paciente, { foreignKey: "paciente_id" });
