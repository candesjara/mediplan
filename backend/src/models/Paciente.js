import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Paciente = sequelize.define(
  "Paciente",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    documento: { type: DataTypes.STRING(50), unique: true },
    telefono: { type: DataTypes.STRING(50) },
    correo: { type: DataTypes.STRING(100), unique: true },
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "pacientes",
    timestamps: false,
  }
);
