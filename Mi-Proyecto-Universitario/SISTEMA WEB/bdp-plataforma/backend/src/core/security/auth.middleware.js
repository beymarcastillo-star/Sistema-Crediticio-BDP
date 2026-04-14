// backend/src/core/security/auth.middleware.js
const { verifyToken } = require('./jwt');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.rol)) {
    return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
  }
  next();
};

module.exports = { authenticate, authorize };
