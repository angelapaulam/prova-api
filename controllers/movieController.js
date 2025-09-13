const { watchedMovies } = require('../models/movieModel');

function addWatchedMovie(req, res) {
  const { titulo } = req.body;
  const usuario = req.user.login;
  if (!titulo) {
    return res.status(400).json({ mensagem: 'Título do filme é obrigatório.' });
  }
  if (watchedMovies.find(m => m.titulo === titulo && m.usuario === usuario)) {
    return res.status(409).json({ mensagem: 'Filme já registrado como assistido.' });
  }
  watchedMovies.push({ titulo, usuario });
  res.status(201).json({ mensagem: 'Filme registrado como assistido.' });
}

function getWatchedMovies(req, res) {
  const usuario = req.user.login;
  const filmes = watchedMovies.filter(m => m.usuario === usuario);
  res.json(filmes);
}

module.exports = {
  addWatchedMovie,
  getWatchedMovies,
};