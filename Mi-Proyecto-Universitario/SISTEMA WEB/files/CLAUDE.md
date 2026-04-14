# BDP — Plataforma Crediticia PYME & Banca Empresa
## Instrucciones para Claude Code

---

## 🎯 OBJETIVO DEL PROYECTO

Construir un sistema web **funcional real** (no un mockup) para el Banco de Desarrollo Productivo S.A.M. de Bolivia. El sistema gestiona créditos para PYMES y Banca Empresa con enfoque en el sector agropecuario boliviano.

**Esta carpeta ya tiene:**
- `bdp-sistema/` → 3 archivos del diseño aprobado (index.html, styles.css, app.js) — **EL FRONTEND DEBE VERSE EXACTAMENTE IGUAL A ESTO**
- `bdp-plataforma/backend/` → Backend parcialmente creado con código real

**Lo que debes construir:**
Dividir y completar todo en la estructura `bdp-plataforma/` siguiendo la arquitectura definida abajo.

---

## 📁 ESTRUCTURA OBJETIVO

```
bdp-plataforma/
├── backend/
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js    ← POST /api/v1/auth/login
│   │   │   │   └── auth.routes.js
│   │   │   ├── creditos/
│   │   │   │   ├── creditos.controller.js
│   │   │   │   └── creditos.routes.js
│   │   │   └── clientes/
│   │   │       ├── clientes.controller.js
│   │   │       └── clientes.routes.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   └── auth.service.js       ← YA EXISTE - lógica JWT + bloqueo 3 intentos
│   │   │   ├── auditoria/
│   │   │   │   └── auditoria.service.js  ← YA EXISTE - logs WORM hash encadenado
│   │   │   ├── creditos/
│   │   │   │   └── creditos.service.js   ← YA EXISTE - CRUD solicitudes
│   │   │   ├── evaluacion/
│   │   │   │   └── evaluacion.service.js ← CREAR - scoring crediticio
│   │   │   └── garantias/
│   │   │       └── garantias.service.js  ← CREAR - gestión colaterales
│   │   ├── core/
│   │   │   ├── config/index.js           ← YA EXISTE
│   │   │   ├── database/
│   │   │   │   ├── db.js                 ← YA EXISTE - Pool PostgreSQL
│   │   │   │   ├── migrations.sql        ← YA EXISTE - esquema completo
│   │   │   │   └── seed.js               ← CREAR - usuarios demo con bcrypt
│   │   │   ├── security/
│   │   │   │   ├── jwt.js                ← YA EXISTE
│   │   │   │   └── auth.middleware.js    ← YA EXISTE - RBAC
│   │   │   └── middleware/
│   │   │       └── error.handler.js      ← YA EXISTE
│   │   └── server.js                     ← CREAR - inicialización Express
│   ├── tests/
│   │   ├── auth.test.js                  ← CREAR
│   │   └── auditoria.test.js             ← CREAR
│   ├── .env.example                      ← YA EXISTE
│   └── package.json                      ← YA EXISTE
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Table.jsx                 ← extraer del mockup
│   │   │   ├── Modal.jsx                 ← extraer del mockup
│   │   │   ├── Badge.jsx                 ← extraer del mockup
│   │   │   └── StatCard.jsx              ← extraer del mockup
│   │   ├── modules/
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardView.jsx     ← extraer de index.html v-dashboard
│   │   │   └── creditos/
│   │   │       ├── SolicitudesView.jsx   ← extraer de index.html v-solicitudes
│   │   │       ├── NuevaSolicitudView.jsx← extraer de index.html v-nueva
│   │   │       ├── EvaluacionView.jsx    ← extraer de index.html v-financiero
│   │   │       ├── RiesgoView.jsx        ← extraer de index.html v-riesgo
│   │   │       └── GarantiasView.jsx     ← extraer de index.html v-garantias
│   │   ├── modules/admin/
│   │   │   └── AdminView.jsx             ← extraer de index.html v-admin
│   │   ├── modules/reportes/
│   │   │   └── ReportesView.jsx          ← extraer de index.html v-reportes
│   │   ├── services/
│   │   │   └── api.js                    ← cliente fetch con JWT interceptor
│   │   ├── App.jsx                       ← SPA router + sidebar + topbar
│   │   ├── main.jsx                      ← entry point React
│   │   └── index.css                     ← COPIAR styles.css del mockup
│   ├── index.html                        ← HTML base Vite
│   └── package.json                      ← React + Vite
├── docker-compose.yml
└── README.md
```

---

## 🎨 DISEÑO — REGLA ABSOLUTA

El frontend **DEBE verse EXACTAMENTE igual** al diseño en `bdp-sistema/index.html`.

**Colores exactos (copiar literalmente):**
```css
--blue-900: #0B2D5E
--blue-800: #0E3A78
--blue-700: #1050A8
--blue-600: #1A62CC
--blue-500: #2273E0
--orange:   #E07820
```

**Fuentes:** Plus Jakarta Sans + IBM Plex Mono (ya definidas en styles.css)

**Pantallas a implementar como componentes React:**
1. Login — pantalla dividida, branding izquierda, formulario derecha
2. Dashboard — 4 KPI cards + tabla solicitudes + gráfico barras sectoriales
3. Solicitudes — tabla filtrable con badges de estado y riesgo
4. Nueva Solicitud — wizard 5 pasos + sector selector + checklist + drag&drop
5. Evaluación Financiera — tabs: Flujo Caja / Balance / Proyecciones / Índices + supuestos en tiempo real
6. Calificación de Riesgo — gauge score + barras por variable
7. Garantías — tabla + modal nueva garantía + cobertura porcentual
8. Panel Administración — tabs: Permisos RBAC / Auditoría Logs / Motor Reglas
9. Reportes — cards de exportación + viewer API REST

**El sidebar, topbar y modales están en `bdp-sistema/index.html` — extraerlos tal cual.**

---

## ⚙️ STACK TÉCNICO

**Backend:** Node.js + Express + PostgreSQL (pg) + JWT (jsonwebtoken) + bcryptjs
**Frontend:** React 18 + Vite + CSS (el mismo styles.css del mockup, sin frameworks CSS externos)
**BD:** PostgreSQL 15

---

## 🔐 HU-01: AUTENTICACIÓN (ya implementada en modules/auth/auth.service.js)

El servicio ya está completo. Lo que falta:

### auth.controller.js
```javascript
// POST /api/v1/auth/login
// Body: { email, password }
// Response: { token, usuario: { id, email, nombre, rol } }
// Errores: 401 credenciales incorrectas, 423 cuenta bloqueada
```

**Usuarios demo para seed.js:**
```
analista@bdp.bo   / password  / rol: analista
admin@bdp.bo      / admin123   / rol: administrador  
comite@bdp.bo     / comite123  / rol: comite
auditoria@bdp.bo  / audit123   / rol: auditor
```

**Flujo real del login:**
1. Recibe email + password
2. Busca usuario en BD, verifica bcrypt
3. Bloquea cuenta tras 3 intentos fallidos (15 min)
4. Genera JWT con { sub, email, nombre, rol, jti }
5. Registra en auditoría WORM
6. Devuelve { token, usuario }

---

## 📋 HU-02: AUDITORÍA WORM (ya implementada en modules/auditoria/auditoria.service.js)

El servicio ya está completo con hash encadenado SHA-256.

### auditoria.controller.js
```javascript
// GET /api/v1/auditoria
// Query params: ?pagina=1&limite=50&operacion=INSERT&tabla=solicitudes
// Headers: Authorization: Bearer <JWT>
// Solo roles: administrador, auditor
// Response: { logs: [...], total, pagina, limite }

// GET /api/v1/auditoria/verificar
// Verifica integridad del log completo
// Response: { integro: true/false, errores: [] }
```

**Estructura de cada log:**
```json
{
  "id": 1847,
  "timestamp_utc": "2024-06-15 14:32:07",
  "usuario_email": "m.avila@bdp.bo",
  "ip_origen": "192.168.1.45",
  "operacion": "UPDATE",
  "tabla": "solicitudes",
  "registro_id": "SOL-2024-089",
  "hash_actual": "a3f7b2c9d1e4f5..."
}
```

---

## 💰 HU-06/07: EVALUACIÓN Y SCORING (crear evaluacion.service.js)

```javascript
// Scoring crediticio — pesos por variable:
const PESOS = {
  financiero: 0.40,  // liquidez, endeudamiento, ROE
  historial:  0.25,  // historial crediticio ASFI
  sectorial:  0.15,  // score por sector (agrícola tiene penalización climática)
  garantias:  0.12,  // cobertura de garantías sobre el monto
  clima:      0.08,  // factor climático (sequía, inundaciones)
};

// Score 0-1000:
// < 500: Alto riesgo
// 500-700: Riesgo moderado  
// > 700: Bajo riesgo

// Cálculo flujo de caja agrícola:
// ingresos = precio_quintal * rendimiento_ha * hectareas * factor_clima
// factor_clima: normal=1.0, sequia_leve=0.85, sequia_moderada=0.70, sequia_severa=0.50
// cobertura_deuda = (ingresos - costos) / servicio_deuda_anual * 100
```

---

## 🏗️ API REST — ENDPOINTS COMPLETOS

```
POST   /api/v1/auth/login              → login, devuelve JWT
POST   /api/v1/auth/logout             → invalida sesión

GET    /api/v1/creditos                → lista solicitudes (auth)
POST   /api/v1/creditos                → crear solicitud (analista)
GET    /api/v1/creditos/:id            → detalle solicitud (auth)
PUT    /api/v1/creditos/:id/estado     → cambiar estado (analista/comite)

GET    /api/v1/clientes                → lista clientes (auth)
POST   /api/v1/clientes                → crear cliente (analista)
GET    /api/v1/clientes/:id            → detalle (auth)

GET    /api/v1/auditoria               → logs (admin/auditor)
GET    /api/v1/auditoria/verificar     → integridad (admin)
```

---

## 🖥️ FRONTEND — CLIENTE API (services/api.js)

```javascript
// Base URL: http://localhost:3001/api/v1
// Interceptor: agrega Authorization: Bearer <token> automáticamente
// Token: guardado en sessionStorage como 'bdp_token'
// En error 401: redirigir a login
```

---

## 🐳 DOCKER COMPOSE

```yaml
# Levantar con: docker-compose up -d
# postgres en puerto 5432
# backend en puerto 3001
# frontend en puerto 5173 (dev) o 80 (prod)
```

---

## ✅ CRITERIOS DE ÉXITO

1. `npm run dev` en backend → servidor en :3001 sin errores
2. `npm run dev` en frontend → UI en :5173 idéntica al mockup
3. Login real → POST /api/v1/auth/login → JWT → sesión iniciada
4. Tabla auditoría → GET /api/v1/auditoria → logs reales de la BD
5. Bloqueo tras 3 intentos fallidos funciona
6. RBAC: auditor solo ve auditoría, analista no ve motor de reglas

---

## 📝 NOTAS IMPORTANTES

- **NO rediseñar el frontend** — copiar el CSS y HTML del mockup exactamente
- **NO usar localStorage** — solo sessionStorage para el token
- **Los archivos YA EXISTENTES** en backend/ no sobreescribir, solo completar lo que falta
- El mockup en `bdp-sistema/` es la fuente de verdad del diseño
- Usar IBM Plex Mono para valores numéricos y código (ya está en el mockup)
