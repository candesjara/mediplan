# 🏥 MediPlan – Sistema de Gestión Médica

Aplicación web desarrollada con **Node.js**, **Express**, **Sequelize**, **React** y **Bootstrap**, que permite gestionar doctores, pacientes y citas médicas de forma sencilla e intuitiva.

---

## 🚀 Características principales

- Registro, edición y eliminación de **pacientes**, **doctores** y **citas**  
- **Autenticación** de usuarios con control de acceso  
- **Validaciones** de formularios y manejo de errores  
- **Interfaz moderna** basada en Bootstrap  
- **API RESTful** conectada a **MySQL** mediante Sequelize  
- Arquitectura **cliente-servidor** modular

---

## 🧠 Estructura del proyecto

```
📦 medi-plan
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🛠️ Instalación y ejecución

### 🔹 Clonar el repositorio
```bash
git clone https://github.com/tuusuario/mediplan.git
cd mediplan
```

### 🔹 Backend
```bash
cd backend
npm install
npm run dev
```

El servidor se ejecutará en `http://localhost:4000`

### 🔹 Frontend
En otra terminal:
```bash
cd frontend
npm install
npm start
```

El cliente se ejecutará en `http://localhost:3000`

---

## 🧩 Variables de entorno (.env)

Crea un archivo `.env` en el directorio `/backend` con los siguientes valores:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_clave
DB_NAME=mediplan
PORT=4000
JWT_SECRET=clave_secreta_segura
```

---

## 🧪 Pruebas

Puedes probar la API con **Postman** o **Insomnia**, usando los endpoints documentados en:
```
/api/doctores
/api/pacientes
/api/citas
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).

---

## 👨‍💻 Autor

**Carlos Andrés Jaramillo Patiño**  
📧 contacto: ing.andres.jaramillo@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/candesjara/)
