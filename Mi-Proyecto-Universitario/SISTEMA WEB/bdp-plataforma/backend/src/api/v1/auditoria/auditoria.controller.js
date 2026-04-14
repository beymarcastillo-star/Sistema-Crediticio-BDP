// backend/src/api/v1/auditoria/auditoria.controller.js
const AuditoriaService = require('../../../modules/auditoria/auditoria.service');

const getLogs = async (req, res, next) => {
  try {
    const { pagina, limite, operacion, tabla, usuario, desde, hasta } = req.query;
    const result = await AuditoriaService.getLogs({
      pagina:    parseInt(pagina, 10)  || 1,
      limite:    parseInt(limite, 10)  || 50,
      operacion, tabla, usuario, desde, hasta,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const verificar = async (req, res, next) => {
  try {
    const result = await AuditoriaService.verificarIntegridad();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, verificar };
