// frontend/src/services/api.js
// Cliente API — conecta con el backend real en /api/v1
// Token guardado en sessionStorage como 'bdp_token'

const BASE_URL = '/api/v1';

const getToken = () => sessionStorage.getItem('bdp_token');

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Token expirado → limpiar sesión
  if (res.status === 401) {
    sessionStorage.removeItem('bdp_token');
    sessionStorage.removeItem('bdp_user');
    window.location.reload();
    return;
  }

  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Error del servidor'), { status: res.status, data });
  return data;
};

export const api = {
  // AUTH
  login:    (email, password)               => request('POST', '/auth/login',    { email, password }),
  registro: (nombre, email, password, rol)  => request('POST', '/auth/registro', { nombre, email, password, rol }),
  logout:   ()                              => request('POST', '/auth/logout'),

  // AUDITORÍA
  getLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/auditoria${qs ? '?' + qs : ''}`);
  },
  verificarIntegridad: () => request('GET', '/auditoria/verificar'),
};
