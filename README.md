# MDMAS - MediPlan (Caso de Estudio Academico)

Aplicacion web academica para gestion medica basica con autenticacion JWT y modulos CRUD de doctores, pacientes y citas.

Este repositorio esta orientado a aprendizaje de desarrollo full stack y documentacion de APIs bajo la guia **GA7-220501096-AA5-EV03**.

## 1) Descripcion General

MediPlan permite:
- Autenticacion de usuarios con JWT.
- Gestion de Doctores.
- Gestion de Pacientes.
- Agenda de Citas con estados (`pendiente`, `confirmada`, `cancelada`).
- Reglas de negocio basicas en backend (validaciones, conflictos de horario, estados).

## 2) Tecnologias Usadas

- Backend: Node.js, Express, Sequelize, MySQL, JWT, bcryptjs
- Frontend: React, React Router, Bootstrap, Axios
- Pruebas: Jest, Supertest, React Testing Library

## 3) Requisitos Previos

- Node.js 18+ recomendado
- npm 9+ recomendado
- MySQL 8+

## 4) Instalacion Paso a Paso

### 4.1 Clonar repositorio

```bash
git clone https://github.com/tuusuario/mediplan.git
cd mediplan
```

### 4.2 Instalar dependencias backend

```bash
cd backend
npm install
```

### 4.3 Instalar dependencias frontend

```bash
cd ../frontend
npm install
```

## 5) Variables de Entorno Necesarias

Crear archivo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_clave
DB_NAME=mediplan
PORT=4000
JWT_SECRET=clave_secreta_segura
```

## 6) Script de Seed

Se incluyo un seed academico para poblar datos dummy:

```bash
cd backend
node src/seed.js
```

Datos base creados:
- 1 admin (`admin@mediplan.com`)
- 2 doctores
- 3 pacientes
- 3 citas futuras validas

## 7) Como Ejecutar Backend

```bash
cd backend
npm run dev
```

Servidor backend: `http://localhost:4000`

## 8) Como Ejecutar Frontend

```bash
cd frontend
npm start
```

Aplicacion frontend: `http://localhost:3000`

## 9) Usuario Demo

- Correo: `admin@mediplan.com`
- Contrasena: `Admin123`
- Rol: `admin`

## 10) Estructura del Proyecto

```text
mediplan/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   └── tests/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── tests/
└── docs/
    └── API_GA7-220501096-AA5-EV03.md
```

## 11) Documentacion de Endpoints (Resumen)

Base URL backend: `http://localhost:4000/api`

- Auth:
`POST /auth/register`, `POST /auth/login`
- Doctores:
`GET /doctores`, `POST /doctores`, `GET /doctores/protegida`
- Pacientes:
`GET /pacientes`, `POST /pacientes`, `PUT /pacientes/:id`, `DELETE /pacientes/:id`
- Citas:
`GET /citas`, `POST /citas`, `PUT /citas/:id`, `DELETE /citas/:id`

Documentacion completa: [docs/API_GA7-220501096-AA5-EV03.md](docs/API_GA7-220501096-AA5-EV03.md)

## 12) Capturas Esperadas en Postman (Explicacion)

Para evidencia academica se recomienda incluir capturas de:
- Login exitoso con token JWT.
- CRUD de Pacientes y Doctores.
- Creacion de Cita en estado `pendiente`.
- Cambio de estado de Cita a `confirmada` y `cancelada`.
- Respuestas de error controlado (400/401/403/404) por validacion.

## 13) Estado Actual del Proyecto

- Login funcional: si
- Roles existentes en modelo/token: si
- CRUD de entidades principales: si
- Acciones de negocio en citas: si
- Pruebas automatizadas: si
- Documentacion API oficial para guia GA7: si

## 14) Creditos y Proposito Academico

Proyecto desarrollado con fines formativos para practicas de:
- Arquitectura cliente-servidor simple
- Modelado de datos con Sequelize
- Seguridad basica con JWT
- Pruebas automatizadas
- Documentacion tecnica de APIs

Autor base del proyecto: **Carlos Andres Jaramillo Patino**  
Adaptaciones y fortalecimiento: uso academico guiado (MDMAS / MediPlan).
