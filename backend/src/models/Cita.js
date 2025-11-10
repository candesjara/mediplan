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
      allowNull: true, // ✅ puede ser NULL si se elimina el doctor
      references: {
        model: Doctor,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ puede ser NULL si se elimina el paciente
      references: {
        model: Paciente,
        key: "id",
      },
      onDelete: "SET NULL",
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
Doctor.hasMany(Cita, { foreignKey: "doctor_id" });
Paciente.hasMany(Cita, { foreignKey: "paciente_id" });
Cita.belongsTo(Doctor, { foreignKey: "doctor_id" });
Cita.belongsTo(Paciente, { foreignKey: "paciente_id" });
