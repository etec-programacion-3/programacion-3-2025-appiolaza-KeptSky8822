# 🏆 FOOTBALL VISION

Nombre: Julian Appiolaza

Aplicación que muestra resultados, tablas, goleadores y permite perfiles personalizados con equipos y jugadores favoritos.

---

## 📌 Descripción General

La plataforma muestra información actualizada de las siguientes competencias:

- **UEFA Champions League**
- **Premier League**
- **LaLiga**
- **Serie A**
- **Bundesliga**
- **Ligue 1**

### Funcionalidades principales:

- ✔️ Resultados de partidos  
- ✔️ Tablas de posiciones  
- ✔️ Máximos goleadores  
- ✔️ Perfiles de usuario  
- ✔️ Equipos y jugadores favoritos  

---

## ⚙️ Requisitos Previos

- **Node.js 18+**
- **npm**
- No se utiliza Docker
- Backend y frontend se instalan por separado

---

## 🔌 Puertos Utilizados

| Servicio   | Puerto | URL |
|-----------|--------|-----|
| Frontend  | **5173** | http://localhost:5173 |
| Backend   | **3000** | http://localhost:3000 |

---

## 📁 Estructura del Proyecto

```
PROYECTO
│
├── Backend
│   ├── node_modules
│   ├── src
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── database.sqlite
│   ├── package.json
│   ├── package-lock.json
│   ├── request.js
│   ├── server.js
│   ├── sync.js
│   ├── syncData.js
│   └── test.js
│
├── frontend
│   ├── dist
│   ├── node_modules
│   ├── public
│   ├── src
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Ejecución del Backend

### 🔧 Instalación

```bash
cd Backend
npm install
```

### ▶️ Iniciar servidor
*** Ejecución dentro de la Carpeta "Backend" ***

```bash
node app.js
```

Backend disponible en:  
➡️ **http://localhost:3000**

---

## 💻 Ejecución del Frontend

### 🔧 Instalación

```bash
cd frontend
npm install
```

### ▶️ Iniciar entorno de desarrollo
*** Ejecución dentro de la Carpeta "frontend" ***
```bash
npm run dev
```

Frontend disponible en:  
➡️ **http://localhost:5173**

---

## 🔐 Variables de Entorno

A continuación se muestran las variables de entorno para **backend** y **frontend**.  
> ⚠️ No subir nunca los archivos `.env` reales al repositorio.  

---

### 🖥️ Backend → `/Backend/.env.example`

```env
# 🔧 Configuración general
PORT=3000

# ⚽ API externa
FOOTBALL_API_KEY=tu_api_key
FOOTBALL_API_URL=https://api.football-data.org/v4/

# 🌍 URL del servidor (Backend)
BACKEND_URL=http://localhost:3000/

# URL del frontend
FRONTEND_URL=http://localhost:5173

# 🔑 Clave secreta JWT
JWT_SECRET=miclavesupersegura123

# 🧪 Token de prueba (opcional)
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYXBwaW9sYXphX19fX0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6Ikp1bGlhbjkwIiwiaWF0IjoxNzYzMDg5NTUwLCJleHAiOjE3NjM2OTQzNTB9.QBQJoOPGVNjJ-iHDc91m21gjAvdJML42ebWHUgmE4U8

# 👤 Credenciales de usuario de prueba (opcional)
EMAIL=appiolaza____@gmail.com
PASSWORD=julian10
``` 
### 🖥️ Frontend → `/frotend/.env.example`
```env
# 🌍 URL del servidor Backend
VITE_API_URL=http://localhost:3000/api

# 🖥️ URL del frontend
VITE_FRONTEND_URL=http://localhost:5173
``` 
### Comando para realizarlo `
Antes de iniciar la aplicación, copia los archivos de ejemplo a `.env` y rellena con tus valores.
```bash
cd Backend
cp .env.example .env

cd ../frontend
cp .env.example .env
``` 
## 📄 Notas Finales

- Asegurate de tener ambos puertos libres antes de iniciar.
- El backend debe estar funcionando para que el frontend pueda consumir datos.

---

