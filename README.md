# AuthApp - Sistema de Autenticación y Gestión de Usuarios

AuthApp es una solución Full Stack desarrollada como prueba técnica, que implementa un sistema robusto de autenticación mediante JWT y un panel de gestión de usuarios basado en roles (Administrador y Usuario).

El proyecto está diseñado siguiendo principios de arquitectura limpia, separación de responsabilidades y buenas prácticas de seguridad.

---

## 🛠 Tecnologías Utilizadas

**Backend**
* **Framework:** .NET 8 (Web API)
* **Base de Datos:** SQL Server 2022 (Ejecutado sobre Docker)
* **ORM:** Entity Framework Core
* **Seguridad:** Autenticación JWT (HS256) y Hash de contraseñas con BCrypt.Net
* **Documentación API:** Swagger / OpenAPI
* **Arquitectura:** Estructura modular basada en capas lógicas (Api, Application, Infrastructure).

**Frontend**
* **Framework:** React 18 con Vite
* **Enrutamiento:** React Router DOM (Rutas públicas y privadas/protegidas por rol)
* **Gestión de Formularios:** React Hook Form
* **Cliente HTTP:** Axios (con interceptores para inyección de JWT)
* **Estado Global:** Context API (AuthContext)
* **Estilos:** CSS Modules / Estilos en línea (Responsive y accesibles)

---

## 📋 Requisitos Previos

Para ejecutar este proyecto localmente, necesitas tener instaladas las siguientes herramientas:

1. **Docker Desktop** (Obligatorio para la base de datos).
2. **.NET 8 SDK** (Obligatorio para el backend).
3. **Node.js** (v18 o superior) y **npm** (Obligatorio para el frontend).

---

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos en orden para levantar el entorno completo.

### 1. Levantar la Base de Datos (Docker)
Abre tu terminal en la raíz del proyecto y ejecuta el siguiente comando para descargar y arrancar la imagen de SQL Server:

```bash
docker run --platform linux/amd64 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SqlPassword123." -p 1433:1433 --name sql_server_local -d [mcr.microsoft.com/mssql/server:2022-latest](https://mcr.microsoft.com/mssql/server:2022-latest)
```

> **Nota:** Si el contenedor ya fue creado previamente y está pausado, puedes iniciarlo simplemente con `docker start sql_server_local`.

### 2. Ejecutar el Backend (.NET)
En una nueva pestaña de la terminal, navega a la carpeta de la API, limpia la solución y arranca el servidor:

```bash
cd backend/AuthApi
dotnet restore
dotnet clean
dotnet run
```

El backend estará escuchando en el puerto local (usualmente http://localhost:5242). Puedes acceder a la documentación interactiva en:
**http://localhost:5242/swagger**

### 3. Ejecutar el Frontend (React)
Abre otra pestaña en tu terminal, navega a la carpeta del frontend, instala las dependencias e inicia el servidor de desarrollo:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en:
**http://localhost:5173**

---

## 🔑 Credenciales y Uso del Sistema

Por defecto, la base de datos se inicializa vacía. Para probar el sistema completo:

1. **Registro:** Accede a la aplicación React y regístrate como un usuario nuevo. El sistema asignará por defecto el rol de `user`.
2. **Perfil de Usuario:** Inicia sesión con tus nuevas credenciales para ver el panel estándar (Solo lectura de perfil propio).
3. **Rol de Administrador:** Para probar el Dashboard de Gestión, debes cambiar manualmente el rol de tu usuario en la base de datos. Conecta tu gestor SQL a `localhost,1433` (User: `sa`, Pass: `SqlPassword123.`) y ejecuta:

```sql
UPDATE Users SET Role = 'admin' WHERE Email = 'tu_correo@ejemplo.com';
```

4. Vuelve a iniciar sesión en el frontend para acceder a las opciones exclusivas de creación, edición, desactivación y eliminación de usuarios.

---

## ✨ Características Principales

* **Autenticación Segura:** Las contraseñas jamás se guardan en texto plano (BCrypt).
* **Autorización por Roles:** Endpoints de la API y rutas de React protegidas rigurosamente según el rol (admin vs user).
* **Resiliencia HTTP:** Manejo de errores controlados (400 Bad Request, 401 Unauthorized, 403 Forbidden, 409 Conflict).
* **UX/UI Consistente:** Diseño oscuro (Dark Mode), feedback visual de carga, alertas de error y confirmaciones de acciones destructivas.


## 👥 Desarrollador

* **Daniel Felipe Dueñas Rodríguez** - *Full Stack & Mobile Software Developer*