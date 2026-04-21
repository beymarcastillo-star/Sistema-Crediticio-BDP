// ============================================================
// TAREAS.js — Registro central de tareas pendientes por pareja
// Solo visible en modo desarrollo (import.meta.env.DEV)
// ============================================================
// PAREJAS:
//   P1 🔵 Azul   — Roger (Frontend) + Kevin (Backend)   — HU-01,04,07,10
//   P2 🟣 Morado — Beymar (Frontend) + Abigail (Backend) — HU-02,05,08,11
//   P3 🟠 Naranja— Norma (Frontend) + Miguel (Backend)   — HU-03,06,09,12
// ============================================================
// ESTADOS: 'pendiente' | 'progreso' | 'listo'
// ============================================================

export const PAREJAS = {
  P1: { color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', nombre: 'P1 · Roger + Kevin', hus: 'HU-01,04,07,10' },
  P2: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', nombre: 'P2 · Beymar + Abigail', hus: 'HU-02,05,08,11' },
  P3: { color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', nombre: 'P3 · Norma + Miguel', hus: 'HU-03,06,09,12' },
};

export const TAREAS_POR_VISTA = {

  // ── Login (App.jsx — pantalla de inicio de sesión) ────────
  // Solo visible en la pantalla de login, antes de entrar al sistema
  Login: [
    { pareja: 'P1', hu: 'HU-01', persona: 'Roger', estado: 'pendiente', tarea: 'Agregar link "¿Olvidaste tu contraseña?" bajo el botón login' },
    { pareja: 'P1', hu: 'HU-01', persona: 'Roger', estado: 'pendiente', tarea: 'Reemplazar mensaje texto plano por toast con color (rojo/verde/amarillo)' },
    { pareja: 'P1', hu: 'HU-01', persona: 'Roger', estado: 'pendiente', tarea: 'Mostrar estado "bloqueado" tras 3 intentos fallidos con cuenta regresiva' },
  ],

  // ── DashboardView.jsx ──────────────────────────────────────
  Dashboard: [
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Instalar recharts y agregar gráfico de líneas/barras de tendencia semanal (8 semanas)' },
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Badge "12" del sidebar debe venir de useState, no ser texto fijo' },
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Botones "Ver"/"Evaluar" de la tabla deben navegar a la vista correcta' },
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Panel de notificaciones al clic en 🔔 (drawer con lista mock)' },
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Badge con contador en ícono 🔔' },
    { pareja: 'P2', hu: 'HU-11', persona: 'Beymar', estado: 'pendiente', tarea: 'Aviso sesión por vencer: banner "Tu sesión expira en 5 min — ¿Renovar?"' },
  ],

  // ── SolicitudesView.jsx ────────────────────────────────────
  Solicitudes: [
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Filtro de búsqueda por texto que filtre la tabla visualmente al escribir' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Dropdowns de Estado y Sector que filtren las filas de la tabla' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Paginación: botones Anterior/Siguiente + indicador "Página X de Y"' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Botones de fila (Evaluar/Detalle/Revisar/Ver) deben navegar a la vista correcta' },
    { pareja: 'P1', hu: 'HU-10', persona: 'Roger', estado: 'pendiente', tarea: 'Chip online/offline en topbar usando navigator.onLine' },
    { pareja: 'P1', hu: 'HU-10', persona: 'Roger', estado: 'pendiente', tarea: 'Banner amarillo "Modo sin conexión" cuando se pierda la red' },
    { pareja: 'P1', hu: 'HU-10', persona: 'Roger', estado: 'pendiente', tarea: 'Banner verde temporal "Conexión restaurada" al volver online' },
  ],

  // ── NuevaSolicitudView.jsx ─────────────────────────────────
  NuevaSolicitud: [
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Dropzone: mostrar lista de archivos con nombre, tamaño e ícono por tipo' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Botón "✕ Eliminar" en cada archivo de la lista' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Barra de progreso simulada al subir archivo (setTimeout)' },
    { pareja: 'P1', hu: 'HU-04', persona: 'Roger', estado: 'pendiente', tarea: 'Error visual si archivo supera 25MB o tipo no permitido' },
    { pareja: 'P1', hu: 'HU-07', persona: 'Roger', estado: 'pendiente', tarea: 'Campos dinámicos para sector Pecuario: especie, cabezas, natalidad, precio/kg' },
    { pareja: 'P1', hu: 'HU-07', persona: 'Roger', estado: 'pendiente', tarea: 'Campos dinámicos para sector Industrial: capacidad, unidades/mes, costo materia prima' },
    { pareja: 'P1', hu: 'HU-07', persona: 'Roger', estado: 'pendiente', tarea: 'Campos dinámicos para sector Transporte: vehículos, rutas, carga, tarifa/km' },
    { pareja: 'P1', hu: 'HU-07', persona: 'Roger', estado: 'pendiente', tarea: 'Campos dinámicos para sector Comercio: tipo, inventario promedio, rotación mensual' },
    { pareja: 'P1', hu: 'HU-07', persona: 'Roger', estado: 'pendiente', tarea: 'Campos dinámicos para sector Energía: fuente, capacidad MW, precio/kWh' },
    { pareja: 'P2', hu: 'HU-05', persona: 'Beymar', estado: 'pendiente', tarea: 'UI Paso 3 — Documentación: checklist con checkbox, progreso "X de 8 docs"' },
    { pareja: 'P2', hu: 'HU-05', persona: 'Beymar', estado: 'pendiente', tarea: 'UI Paso 4 — Evaluación: resumen de datos + textarea observaciones analista' },
    { pareja: 'P2', hu: 'HU-05', persona: 'Beymar', estado: 'pendiente', tarea: 'UI Paso 5 — Comité: resumen ejecutivo + botones Aprobar/Observar/Rechazar' },
    { pareja: 'P2', hu: 'HU-05', persona: 'Beymar', estado: 'pendiente', tarea: 'Botón "Enviar a Evaluación" visible, deshabilitado con tooltip hasta completar docs' },
    { pareja: 'P2', hu: 'HU-05', persona: 'Beymar', estado: 'pendiente', tarea: 'Botón "Guardar borrador" en todos los pasos' },
  ],

  // ── EvaluacionView.jsx ─────────────────────────────────────
  Evaluacion: [
    { pareja: 'P3', hu: 'HU-06', persona: 'Norma', estado: 'pendiente', tarea: 'Pestaña Proyecciones: instalar recharts y agregar gráfico barras agrupadas 5 años (Ingresos/Costos/Utilidad)' },
    { pareja: 'P3', hu: 'HU-06', persona: 'Norma', estado: 'pendiente', tarea: 'Pestaña Flujo de Caja: agregar gráfico de líneas mensual (12 meses mock)' },
    { pareja: 'P3', hu: 'HU-06', persona: 'Norma', estado: 'pendiente', tarea: 'Selector de escenario global: Optimista / Base / Pesimista que cambie los valores' },
    { pareja: 'P3', hu: 'HU-06', persona: 'Norma', estado: 'pendiente', tarea: 'Botones Excel/PDF del modal Resumen Comité deben mostrar spinner de carga' },
  ],

  // ── RiesgoView.jsx ─────────────────────────────────────────
  Riesgo: [
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Reemplazar gauge CSS por gauge/velocímetro real con recharts (semicírculo con aguja)' },
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Sección "Desglose del puntaje": tabla con variable, peso% y puntaje parcial' },
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Sección "Recomendaciones" según rango de score (>800 verde, 600-800 amarillo, <600 rojo)' },
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Card "Historial de scores" con 3 evaluaciones anteriores (mock data)' },
  ],

  // ── GarantiasView.jsx ──────────────────────────────────────
  Garantias: [
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Botones Editar/Eliminar en cada fila de garantías' },
    { pareja: 'P2', hu: 'HU-08', persona: 'Beymar', estado: 'pendiente', tarea: 'Validaciones visuales (mensajes de error) en modal "Nueva Garantía"' },
  ],

  // ── AdminView.jsx ──────────────────────────────────────────
  Admin: [
    { pareja: 'P2', hu: 'HU-02', persona: 'Beymar', estado: 'pendiente', tarea: 'Toggles de matriz de permisos deben cambiar estado visualmente al hacer clic' },
    { pareja: 'P2', hu: 'HU-02', persona: 'Beymar', estado: 'pendiente', tarea: 'Botón "+ Nuevo Usuario" con modal: nombre, email, rol' },
    { pareja: 'P2', hu: 'HU-02', persona: 'Beymar', estado: 'pendiente', tarea: 'Botones Editar/Desactivar en cada tarjeta de usuario' },
    { pareja: 'P2', hu: 'HU-02', persona: 'Beymar', estado: 'pendiente', tarea: 'Modal de confirmación al cambiar un permiso' },
    { pareja: 'P3', hu: 'HU-03', persona: 'Norma', estado: 'pendiente', tarea: 'Input "Filtrar por usuario" debe filtrar la lista de logs visualmente' },
    { pareja: 'P3', hu: 'HU-03', persona: 'Norma', estado: 'pendiente', tarea: 'Selector de operación: Todos / INSERT / UPDATE / DELETE / SELECT' },
    { pareja: 'P3', hu: 'HU-03', persona: 'Norma', estado: 'pendiente', tarea: 'Paginación de logs: Anterior/Siguiente + "Página X de Y"' },
    { pareja: 'P3', hu: 'HU-03', persona: 'Norma', estado: 'pendiente', tarea: 'Modal de detalle al clic en fila: hash completo, datos antes/después' },
    { pareja: 'P3', hu: 'HU-03', persona: 'Norma', estado: 'pendiente', tarea: 'Botón "Verificar integridad" con resultado visual ✅/❌' },
    { pareja: 'P3', hu: 'HU-12', persona: 'Norma', estado: 'pendiente', tarea: 'Botón "Guardar cambios" del Motor de Reglas con spinner → "Guardado ✓"' },
    { pareja: 'P3', hu: 'HU-12', persona: 'Norma', estado: 'pendiente', tarea: 'Botón "Restaurar por defecto" con modal de confirmación' },
  ],

  // ── ReportesView.jsx ───────────────────────────────────────
  Reportes: [
    { pareja: 'P3', hu: 'HU-09', persona: 'Norma', estado: 'pendiente', tarea: 'Reemplazar checklist estático por tarjetas de estado dinámico con botón "Probar conexión"' },
    { pareja: 'P3', hu: 'HU-09', persona: 'Norma', estado: 'pendiente', tarea: 'Sección "Últimas sincronizaciones": tabla con timestamp, operación y resultado (mock)' },
    { pareja: 'P3', hu: 'HU-12', persona: 'Norma', estado: 'pendiente', tarea: 'Filtros antes de generar: selector de solicitud, rango de fechas, sector' },
    { pareja: 'P3', hu: 'HU-12', persona: 'Norma', estado: 'pendiente', tarea: 'Botón "Generar PDF": spinner "Generando..." → "Reporte listo — Descargar"' },
    { pareja: 'P3', hu: 'HU-12', persona: 'Norma', estado: 'pendiente', tarea: 'Botón "Exportar Excel": mismo flujo de spinner que PDF' },
  ],
};
