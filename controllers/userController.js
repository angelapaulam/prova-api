const { users } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const SECRET = 'segredo';

function login(req, res) {
  const { login, senha } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
  }
  const user = users.find(u => u.login === login && u.senha === senha);
  if (!user) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
  }
  const token = jwt.sign({ login: user.login }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}

function register(req, res) {
  const { login, senha } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
  }
  if (users.find(u => u.login === login)) {
    return res.status(409).json({ mensagem: 'Usuário já existe.' });
  }
  users.push({ login, senha });
  res.status(201).json({ mensagem: 'Usuário registrado com sucesso.' });
}

function getUsers(req, res) {
  res.json(users.map(u => ({ login: u.login })));
}

module.exports = {
  login,
  register,
  getUsers,
};