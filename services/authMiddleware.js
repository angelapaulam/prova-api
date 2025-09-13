const jwt = require('jsonwebtoken');
const SECRET = 'segredo';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não informado.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }
}

module.exports = authMiddleware;