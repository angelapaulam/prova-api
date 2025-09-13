const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userController = require('./controllers/userController');
const movieController = require('./controllers/movieController');
const authMiddleware = require('./services/authMiddleware');

const app = express();
app.use(express.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas de usuário
app.post('/login', userController.login);
app.post('/registro', userController.register);
app.get('/usuarios', userController.getUsers);

// Rotas de filmes assistidos (protegidas)
app.post('/filmes-assistidos', authMiddleware, movieController.addWatchedMovie);
app.get('/filmes-assistidos', authMiddleware, movieController.getWatchedMovies);

module.exports = app;