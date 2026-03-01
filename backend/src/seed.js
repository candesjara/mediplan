import bcrypt from "bcryptjs";
import { sequelize, conectarDB } from "./config/database.js";
import { Usuario } from "./models/Usuario.js";
import { Doctor } from "./models/Doctor.js";
import { Paciente } from "./models/Paciente.js";
import { Cita } from "./models/Cita.js";

const runSeed = async () => {
  try {
    console.log("Iniciando seed academico de MediPlan...");

    await conectarDB();
    await sequelize.sync();
    console.log("Tablas sincronizadas.");

    // 1) Usuario administrador
    const adminExistente = await Usuario.findOne({
      where: { correo: "admin@mediplan.com" },
    });

    let admin;
    if (adminExistente) {
      admin = adminExistente;
      console.log(`Admin ya existe (id=${admin.id}, correo=${admin.correo}).`);
    } else {
      const hash = bcrypt.hashSync("Admin123", 10);
      admin = await Usuario.create({
        nombre: "Administrador MediPlan",
        correo: "admin@mediplan.com",
        password: hash,
        rol: "admin",
      });
      console.log(`Admin creado (id=${admin.id}, correo=${admin.correo}).`);
    }

    // 2) Doctores
    const doctoresData = [
      {
        nombre: "Dra. Laura Gomez",
        especialidad: "Medicina General",
        telefono: "3001112233",
        correo: "laura.gomez@mediplan.com",
      },
      {
        nombre: "Dr. Carlos Ruiz",
        especialidad: "Pediatria",
        telefono: "3004445566",
        correo: "carlos.ruiz@mediplan.com",
      },
    ];

    const doctores = [];
    for (const data of doctoresData) {
      const existente = await Doctor.findOne({ where: { correo: data.correo } });
      if (existente) {
        doctores.push(existente);
        console.log(`Doctor ya existe (id=${existente.id}, correo=${existente.correo}).`);
      } else {
        const creado = await Doctor.create(data);
        doctores.push(creado);
        console.log(`Doctor creado (id=${creado.id}, nombre=${creado.nombre}).`);
      }
    }

    // 3) Pacientes
    const pacientesData = [
      {
        nombre: "Ana Martinez",
        documento: "1001001",
        telefono: "3111002000",
        correo: "ana.martinez@correo.com",
      },
      {
        nombre: "Luis Fernandez",
        documento: "1001002",
        telefono: "3111003000",
        correo: "luis.fernandez@correo.com",
      },
      {
        nombre: "Sofia Herrera",
        documento: "1001003",
        telefono: "3111004000",
        correo: "sofia.herrera@correo.com",
      },
    ];

    const pacientes = [];
    for (const data of pacientesData) {
      const existente = await Paciente.findOne({ where: { documento: data.documento } });
      if (existente) {
        pacientes.push(existente);
        console.log(`Paciente ya existe (id=${existente.id}, documento=${existente.documento}).`);
      } else {
        const creado = await Paciente.create(data);
        pacientes.push(creado);
        console.log(`Paciente creado (id=${creado.id}, nombre=${creado.nombre}).`);
      }
    }

    // 4) Citas futuras y sin conflicto (horarios distintos)
    const now = new Date();
    const cita1Fecha = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 dia
    cita1Fecha.setHours(9, 0, 0, 0);
    const cita2Fecha = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 dia
    cita2Fecha.setHours(10, 0, 0, 0);
    const cita3Fecha = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 dias
    cita3Fecha.setHours(11, 0, 0, 0);

    const citasData = [
      {
        fecha: cita1Fecha,
        estado: "pendiente",
        doctor_id: doctores[0].id,
        paciente_id: pacientes[0].id,
      },
      {
        fecha: cita2Fecha,
        estado: "confirmada",
        doctor_id: doctores[0].id,
        paciente_id: pacientes[1].id,
      },
      {
        fecha: cita3Fecha,
        estado: "pendiente",
        doctor_id: doctores[1].id,
        paciente_id: pacientes[2].id,
      },
    ];

    for (const data of citasData) {
      const existente = await Cita.findOne({
        where: {
          fecha: data.fecha,
          doctor_id: data.doctor_id,
          paciente_id: data.paciente_id,
        },
      });

      if (existente) {
        console.log(`Cita ya existe (id=${existente.id}, fecha=${existente.fecha}).`);
      } else {
        const creada = await Cita.create(data);
        console.log(
          `Cita creada (id=${creada.id}, doctor_id=${creada.doctor_id}, paciente_id=${creada.paciente_id}).`
        );
      }
    }

    console.log("Seed completado correctamente.");
  } catch (error) {
    console.error("Error ejecutando seed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log("Conexion a base de datos cerrada.");
  }
};

runSeed();
