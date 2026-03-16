# Documentacion tecnica del frontend MediPlan

## 1. Descripcion general del proyecto

El frontend de MediPlan es una aplicacion React para una gestion medica basica. Segun el codigo disponible y el `README.md` del repositorio, su objetivo es permitir:

- autenticacion de usuario,
- acceso a un dashboard,
- consulta de doctores,
- gestion de pacientes,
- gestion de citas.

La conexion con el backend se hace por HTTP usando Axios. El cliente HTTP esta centralizado en `frontend/src/api/axiosConfig.js` y usa como base `http://localhost:4000/api`. Desde ahi se consumen estos endpoints observados en el frontend:

- `POST /auth/login`
- `GET /doctores`
- `GET /pacientes`
- `POST /pacientes`
- `PUT /pacientes/:id`
- `DELETE /pacientes/:id`
- `GET /citas`
- `POST /citas`
- `PUT /citas/:id`
- `DELETE /citas/:id`

El flujo principal que se puede inferir del codigo es este:

1. El usuario entra a `/` y ve la pantalla de login.
2. Al autenticarse, se guarda `token` y `user` en `localStorage` mediante `AuthContext`.
3. El usuario es redirigido a `/dashboard`.
4. Desde el dashboard o la barra superior navega a doctores, pacientes o citas.
5. Las paginas protegidas consumen la API y renderizan tablas y formularios con Bootstrap.
6. Al cerrar sesion se limpia `localStorage` y se bloquea el acceso a rutas privadas.

## 2. Estructura del proyecto

Estructura principal observada dentro de `frontend/`:

- `build/`: salida generada de produccion. No es critica como codigo fuente, pero si para despliegue cuando se ejecuta `npm run build`.
- `coverage/`: reportes generados de pruebas. No es critica para ejecutar la app.
- `node_modules/`: dependencias instaladas. Necesaria para desarrollo y build, pero generada.
- `public/`: plantilla HTML y archivos publicos de Create React App. Critica para el arranque de la SPA.
- `src/`: codigo fuente principal del frontend. Es la carpeta mas critica del proyecto.
- `.gitignore`: reglas de versionado.
- `package.json`: scripts y dependencias del frontend. Critico.
- `package-lock.json`: bloqueo de versiones instaladas.
- `README.md`: documentacion generica de Create React App, no especifica del proyecto.

Carpetas y archivos criticos para el funcionamiento real del frontend:

- `src/`
- `public/`
- `package.json`
- `src/index.js`
- `src/App.js`
- `src/api/axiosConfig.js`
- `src/context/AuthContext.jsx`

## 3. Explicacion detallada de carpetas clave

### `src/`

Contiene toda la logica principal del frontend.

Archivos destacados:

- `src/index.js`: punto de entrada de React.
- `src/App.js`: define el enrutamiento.
- `src/setupTests.js`: configuracion global de Jest.
- `src/reportWebVitals.js`: utilitario heredado de CRA para metricas.
- `src/App.test.js`: prueba basica del render inicial.
- `src/index.css`: estilos globales basicos.
- `src/App.css`: estilos heredados de CRA; no se observan importados en el proyecto actual.
- `src/logo.svg`: asset heredado de CRA; no se observa usado.

Relacion con otras partes:

- `src/index.js` monta `App`.
- `App.js` conecta contexto, router, layout y paginas.
- Las subcarpetas `api`, `context`, `components`, `pages`, `tests` y `utils` se consumen desde aqui.

### `src/api/`

Contiene la configuracion HTTP compartida.

Archivo destacado:

- `src/api/axiosConfig.js`

Funcion real:

- crea una instancia de Axios con `baseURL: "http://localhost:4000/api"`,
- agrega un interceptor de request,
- si existe `token` en `localStorage`, envia `Authorization: Bearer <token>`.

Relacion con otras partes:

- `Login.jsx`, `Doctores.jsx`, `Pacientes.jsx` y `Citas.jsx` importan esta instancia.
- No existe una carpeta `services/`; las paginas llaman a la API directamente.

### `src/components/`

Contiene componentes compartidos de estructura y navegacion.

Archivos destacados:

- `src/components/Layout.jsx`
- `src/components/NavbarMediPlan.jsx`

Funcion real:

- `Layout.jsx` renderiza la barra superior y envuelve el contenido de paginas privadas.
- `NavbarMediPlan.jsx` muestra enlaces a rutas protegidas y permite cerrar sesion.

Relacion con otras partes:

- `App.js` usa `Layout` para `/dashboard`, `/doctores`, `/pacientes` y `/citas`.
- `NavbarMediPlan.jsx` depende de `AuthContext`.

Observacion:

- No se aprecia una separacion entre componentes puramente visuales y contenedores con logica compleja. La mayor parte de la logica vive en `pages/`.

### `src/context/`

Contiene el estado global compartido de autenticacion.

Archivo destacado:

- `src/context/AuthContext.jsx`

Funcion real:

- expone `user`, `login` y `logout`,
- inicializa `user` desde `localStorage`,
- guarda `token` y `user` al iniciar sesion,
- limpia ambos al cerrar sesion.

Relacion con otras partes:

- `App.js` usa `AuthProvider` y consulta `AuthContext` para `PrivateRoute`.
- `Login.jsx` usa `login`.
- `Dashboard.jsx` y `NavbarMediPlan.jsx` usan `user` y `logout`.

### `src/pages/`

Contiene las vistas principales de la aplicacion.

Archivos destacados:

- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Doctores.jsx`
- `src/pages/Pacientes.jsx`
- `src/pages/Citas.jsx`

Funcion real:

- `Login.jsx`: formulario de autenticacion.
- `Dashboard.jsx`: vista de bienvenida y accesos rapidos.
- `Doctores.jsx`: consulta de listado de doctores.
- `Pacientes.jsx`: CRUD de pacientes con formulario y tabla.
- `Citas.jsx`: CRUD de citas, con carga adicional de doctores y pacientes para selects.

Relacion con otras partes:

- Todas las rutas viven en `App.js`.
- Todas las paginas privadas se renderizan dentro de `Layout`.
- `Login.jsx`, `Doctores.jsx`, `Pacientes.jsx` y `Citas.jsx` dependen de `api/axiosConfig.js`.
- `Login.jsx` y `Dashboard.jsx` dependen ademas de `AuthContext`.

Observacion importante:

- La carpeta `pages/` concentra a la vez UI, estado local y llamadas HTTP. No hay una capa intermedia de servicios o hooks personalizados.

### `src/tests/`

Contiene pruebas del frontend agrupadas por tipo.

Subcarpetas observadas:

- `src/tests/unit/`
- `src/tests/integration/`

Archivos destacados:

- `src/tests/unit/AuthContext.test.jsx`
- `src/tests/integration/App.login.int.test.jsx`

Relacion con otras partes:

- Validan `AuthContext` y el flujo de login.
- `src/setupTests.js` aporta mocks globales para Axios y SweetAlert2.

Observacion:

- Ademas de `src/tests/`, existe `src/App.test.js` fuera de esa estructura. La ubicacion de pruebas no es totalmente uniforme.

### `src/utils/`

Contiene utilidades auxiliares.

Archivo destacado:

- `src/utils/alerts.js`

Funcion real:

- encapsula `sweetalert2` en helpers `alertSuccess`, `alertError` y `alertConfirm`.

Relacion con otras partes:

- No se observaron imports de `alerts.js` en el codigo actual.

Conclusiones practicas:

- existe como utilidad disponible,
- pero el frontend actual usa mensajes inline Bootstrap y `window.confirm` en vez de esta capa.

### `public/`

Contiene los archivos estaticos base de Create React App.

Archivos destacados:

- `public/index.html`
- `public/manifest.json`
- `public/favicon.ico`
- `public/logo192.png`
- `public/logo512.png`
- `public/robots.txt`

Funcion real:

- `index.html` define el contenedor `root`.
- `manifest.json` y los logos son los valores por defecto de CRA.

Observacion importante:

- El `title` sigue siendo `React App`.
- La descripcion y el manifest siguen siendo genericos de Create React App.

### Carpetas que no existen en este frontend

No se observaron estas carpetas en `frontend/src/`:

- `services/`
- `hooks/`
- `routes/`
- `assets/`

Esto importa porque:

- las llamadas a API no estan desacopladas en servicios,
- no hay hooks personalizados visibles,
- el enrutamiento esta centralizado en `src/App.js`,
- no hay carpeta dedicada a recursos graficos dentro de `src/`.

## 4. Paginas y navegacion

Las paginas estan definidas en `src/pages/` y el enrutamiento esta definido completamente en `src/App.js`.

Funcionamiento del router:

- usa `BrowserRouter`,
- define rutas con `Routes` y `Route`,
- crea un componente local `PrivateRoute`,
- `PrivateRoute` consulta `AuthContext`,
- si `user` es `null`, redirige a `/` con `Navigate`.

Rutas observadas:

- `/`: `Login`
- `/dashboard`: `Dashboard`
- `/doctores`: `Doctores`
- `/pacientes`: `Pacientes`
- `/citas`: `Citas`

Comportamiento de navegacion:

- `Login` redirige a `/dashboard` al autenticar.
- `NavbarMediPlan` ofrece navegacion superior entre modulos.
- `Pacientes`, `Doctores` y `Citas` incluyen un boton `Volver` a `/dashboard`.

Paginas principales y su proposito:

- `Login`: autenticar al usuario.
- `Dashboard`: mostrar bienvenida y accesos rapidos.
- `Doctores`: visualizar el listado de doctores.
- `Pacientes`: crear, editar, listar y eliminar pacientes.
- `Citas`: crear, editar, listar y eliminar citas.

Limitaciones observadas:

- no existe ruta comodin tipo `*` para 404,
- no existe separacion en un modulo dedicado de rutas,
- la pagina de doctores no implementa CRUD en frontend, solo listado.

## 5. Componentes

Los componentes reutilizables estan en `src/components/`.

Componentes observados:

- `Layout.jsx`
- `NavbarMediPlan.jsx`

Diferenciacion funcional:

- componentes de UI/estructura:
  - `Layout.jsx`
  - `NavbarMediPlan.jsx`
- componentes con logica de negocio compleja:
  - no se observan como capa separada; la logica de negocio esta principalmente en `pages/`

Detalle practico:

- `Layout` es un wrapper comun para paginas privadas.
- `NavbarMediPlan` combina presentacion con una pequena logica de sesion y navegacion.

No se observo una biblioteca propia de componentes reutilizables ni una carpeta de componentes atomicos.

## 6. Consumo de API

Las llamadas al backend se hacen desde las paginas, no desde una capa de servicios separada.

Archivo central:

- `src/api/axiosConfig.js`

Organizacion real:

- `Login.jsx` hace `api.post("/auth/login", { correo, password })`.
- `Doctores.jsx` hace `api.get("/doctores")`.
- `Pacientes.jsx` hace `get`, `post`, `put` y `delete` sobre `/pacientes`.
- `Citas.jsx` hace `get`, `post`, `put` y `delete` sobre `/citas` y ademas consulta `/doctores` y `/pacientes`.

Configuracion observada:

- Axios con `baseURL` fija a `http://localhost:4000/api`.
- Interceptor de request para agregar `Authorization`.
- Token tomado de `localStorage`.

Lo que no se observo:

- variables de entorno frontend para la URL base,
- `proxy` en `package.json`,
- interceptores de respuesta,
- renovacion de token,
- refresh token,
- manejo centralizado de errores,
- wrappers de `fetch`,
- una carpeta `services/`.

Implicacion de arquitectura:

- el consumo HTTP es simple y directo,
- pero queda acoplado a cada pagina,
- y la URL del backend queda fija al entorno local.

## 7. Manejo de estado

El proyecto usa dos niveles de estado:

- estado global minimo con Context API para autenticacion,
- estado local por pagina con `useState` y `useEffect`.

Implementacion observada:

- `src/context/AuthContext.jsx` gestiona `user`, `login` y `logout`.
- `src/pages/Login.jsx`, `src/pages/Dashboard.jsx` y `src/components/NavbarMediPlan.jsx` dependen de ese contexto.
- `src/pages/Doctores.jsx`, `src/pages/Pacientes.jsx` y `src/pages/Citas.jsx` gestionan su propio estado local.

No se observaron estas soluciones:

- Redux
- Zustand
- React Query
- SWR
- hooks personalizados para cache o sincronizacion de datos

Persistencia:

- la sesion se persiste con `localStorage`.

Observacion importante:

- el frontend considera autentico al usuario si existe `user` en contexto/localStorage; no se ve una validacion activa del token al arrancar la app.

## 8. Pruebas

Si existen pruebas en el frontend.

Ubicacion real:

- `src/App.test.js`
- `src/tests/unit/AuthContext.test.jsx`
- `src/tests/integration/App.login.int.test.jsx`

Tipo de pruebas que se puede inferir:

- `src/App.test.js`: prueba basica de render.
- `src/tests/unit/AuthContext.test.jsx`: prueba unitaria del contexto de autenticacion.
- `src/tests/integration/App.login.int.test.jsx`: prueba de integracion del flujo de login a nivel de UI + almacenamiento de sesion.

Herramientas observadas:

- Jest
- React Testing Library
- `@testing-library/jest-dom`

Configuracion de pruebas:

- `src/setupTests.js` mockea Axios y SweetAlert2 globalmente.

Lo que no se observo:

- pruebas end-to-end,
- pruebas especificas para `Pacientes.jsx`,
- pruebas especificas para `Citas.jsx`,
- pruebas especificas para `Doctores.jsx`,
- pruebas de navegacion protegida,
- pruebas de errores de red en los CRUD principales.

Estado verificado localmente:

- `npm test -- --watch=false` en `frontend/`: 3 suites aprobadas, 4 pruebas aprobadas.

Adicional:

- existe `frontend/coverage/` con reportes generados.

## 9. Dependencias importantes

Segun `frontend/package.json`, las dependencias mas relevantes son:

- `react` y `react-dom`: base de la aplicacion.
- `react-router-dom`: navegacion SPA y proteccion de rutas.
- `axios`: cliente HTTP para comunicacion con el backend.
- `bootstrap`: estilos y layout base.
- `bootstrap-icons`: iconografia disponible.
- `sweetalert2`: libreria para alertas modales.
- `react-scripts`: toolchain de Create React App para dev, build y test.
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`, `@testing-library/user-event`: pruebas de componentes y UI.
- `web-vitals`: utilitario heredado de CRA para metricas.

Observaciones reales sobre uso:

- `bootstrap` y `bootstrap-icons` si se importan en `src/index.js`.
- `react-bootstrap` esta instalada en `package.json`, pero no se observaron imports de `react-bootstrap` en `src/`.
- `sweetalert2` esta encapsulada en `src/utils/alerts.js`, pero esa utilidad no se observa usada.

## 10. Flujo tecnico resumido

El arranque tecnico del frontend funciona asi:

1. `src/index.js` importa Bootstrap, iconos y estilos globales.
2. `src/index.js` crea el root de React y renderiza `App` dentro de `React.StrictMode`.
3. `src/App.js` envuelve toda la app en `AuthProvider`.
4. `src/App.js` monta `BrowserRouter` y define rutas publicas y privadas.
5. `PrivateRoute` valida si hay `user` en contexto.
6. En rutas privadas, `Layout` monta `NavbarMediPlan` y luego la pagina correspondiente.
7. Cada pagina maneja su propio estado y, cuando necesita datos, llama a la API via `api`.
8. `AuthContext` sincroniza sesion entre React y `localStorage`.

Punto de entrada principal:

- `src/index.js`

Punto de orquestacion funcional:

- `src/App.js`

## 11. Riesgos, deuda tecnica o puntos sensibles

Estos son los puntos sensibles observados directamente en el codigo:

### URL del backend hardcodeada

`src/api/axiosConfig.js` fija `http://localhost:4000/api`. No se observaron variables de entorno ni configuracion por ambiente. Esto hace mas fragil el despliegue fuera del entorno local.

### Acoplamiento entre UI y acceso a datos

`Pacientes.jsx` y `Citas.jsx` mezclan:

- render,
- estado local,
- carga inicial,
- envio de formularios,
- mensajes,
- llamadas HTTP.

Esto vuelve esas paginas mas dificiles de extender, probar y reutilizar.

### Duplicacion de patrones

Las paginas CRUD repiten patrones de:

- `loading`,
- `mensaje`,
- `handleSubmit`,
- `handleDelete`,
- `window.confirm`,
- recarga posterior de tablas.

Seria una zona natural para extraer helpers o hooks, pero hoy no existe esa capa.

### Cobertura funcional parcial en doctores

Aunque el dashboard habla de "Gestionar Doctores", el archivo `src/pages/Doctores.jsx` implementa solo listado. No se observan formularios ni acciones de crear, editar o eliminar en el frontend.

### Sesion basada en `localStorage` sin validacion visible

La proteccion de rutas depende de `user` cargado desde `localStorage`. No se ve:

- verificacion del token al iniciar,
- expiracion gestionada en frontend,
- refresh token,
- logout automatico por 401.

### Estructura de pruebas poco uniforme

Hay pruebas dentro de `src/tests/`, pero `src/App.test.js` esta fuera de esa carpeta. No es grave, pero si inconsistente.

### Restos de Create React App

Se observan varios elementos genericos de CRA que no parecen adaptados al dominio del proyecto:

- `frontend/README.md` sigue siendo el default de CRA.
- `public/index.html` mantiene el titulo `React App`.
- `public/manifest.json` sigue con nombre generico.
- `src/App.css` permanece en el proyecto, pero no se observa importado.
- `src/logo.svg` permanece en el proyecto, pero no se observa usado.

### Import duplicado de Bootstrap

`src/index.js` importa dos veces `bootstrap/dist/css/bootstrap.min.css`. No rompe la aplicacion, pero es redundante.

### Dependencias instaladas pero no integradas

Se observa `react-bootstrap` en `package.json`, pero no se ven imports de esa libreria en `src/`. Tambien existe `src/utils/alerts.js`, pero no se utiliza en las paginas actuales.

### Cobertura de pruebas limitada

Las pruebas verifican autenticacion y render inicial, pero no cubren de forma visible:

- CRUD de pacientes,
- CRUD de citas,
- carga de doctores,
- rutas protegidas completas,
- estados de error de cada modulo.

## 12. Resumen final

El frontend de MediPlan es una SPA pequena y directa construida con React y Create React App. Su arquitectura actual es simple: rutas en `App.js`, autenticacion con Context API, llamadas HTTP centralizadas solo a nivel de configuracion Axios, y la mayor parte de la logica concentrada en las paginas.

Para un desarrollador nuevo, el proyecto es facil de recorrer porque tiene pocas capas, pero precisamente por eso hay acoplamiento entre UI, estado y API. Los puntos mas importantes para entenderlo rapido son `src/index.js`, `src/App.js`, `src/context/AuthContext.jsx`, `src/api/axiosConfig.js` y la carpeta `src/pages/`.

## Guia para entender el proyecto rapidamente

### Por donde empezar a leer

Orden recomendado de lectura:

1. `README.md` del repositorio raiz para el contexto funcional general.
2. `frontend/src/index.js` para el arranque tecnico.
3. `frontend/src/App.js` para entender rutas y proteccion.
4. `frontend/src/context/AuthContext.jsx` para la sesion.
5. `frontend/src/api/axiosConfig.js` para la comunicacion con backend.
6. `frontend/src/pages/Login.jsx` para el punto de entrada funcional.
7. `frontend/src/pages/Pacientes.jsx` y `frontend/src/pages/Citas.jsx` para ver la mayor parte de la logica de negocio del frontend.

### Que archivos revisar primero

Archivos recomendados para una primera pasada:

- `frontend/src/index.js`
- `frontend/src/App.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/api/axiosConfig.js`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/NavbarMediPlan.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Pacientes.jsx`
- `frontend/src/pages/Citas.jsx`
- `frontend/src/pages/Doctores.jsx`

### Que carpetas entender antes de modificar codigo

Antes de hacer cambios conviene entender:

- `src/pages/`: porque concentra la logica funcional.
- `src/context/`: porque controla autenticacion y rutas privadas.
- `src/api/`: porque define la comunicacion con backend y el header `Authorization`.
- `src/components/`: porque afecta la estructura comun de todas las vistas privadas.
- `src/tests/`: para no romper la base existente y ampliar cobertura donde haga falta.

### Que parte conecta con el backend

La conexion central con backend esta en:

- `frontend/src/api/axiosConfig.js`

Las llamadas concretas al backend estan en:

- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Doctores.jsx`
- `frontend/src/pages/Pacientes.jsx`
- `frontend/src/pages/Citas.jsx`

### Donde estan las vistas principales

Las vistas principales estan en:

- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Doctores.jsx`
- `frontend/src/pages/Pacientes.jsx`
- `frontend/src/pages/Citas.jsx`

La navegacion comun de vistas privadas esta en:

- `frontend/src/components/NavbarMediPlan.jsx`
- `frontend/src/components/Layout.jsx`

### Donde estan las pruebas

Las pruebas del frontend estan en:

- `frontend/src/App.test.js`
- `frontend/src/tests/unit/AuthContext.test.jsx`
- `frontend/src/tests/integration/App.login.int.test.jsx`

La configuracion base de pruebas esta en:

- `frontend/src/setupTests.js`
