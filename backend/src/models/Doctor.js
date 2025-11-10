// src/models/Doctor.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"; // 👈 ESTA IMPORTACIÓN ES CRUCIAL

export const Doctor = sequelize.define(
  "Doctor",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    especialidad: { type: DataTypes.STRING(100), allowNull: false },
    telefono: { type: DataTypes.STRING(50) },
    correo: { type: DataTypes.STRING(100), unique: true },
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "doctores",
    timestamps: false,
  }
);
