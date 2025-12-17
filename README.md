# API de Catálogo de Filmes Assistidos

Esta API permite o registro e consulta de usuários e filmes assistidos, com autenticação via JWT e documentação Swagger.

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```bash
   npm install express swagger-ui-express jsonwebtoken
   ```

## Execução

Para iniciar o servidor:
```bash
node server.js
```

A API estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

## Endpoints

- `POST /login`: Realiza login do usuário (retorna token JWT).
- `POST /registro`: Registra novo usuário.
- `GET /usuarios`: Lista todos os usuários cadastrados.
- `POST /filmes-assistidos`: Registra filme assistido (requer autenticação).
- `GET /filmes-assistidos`: Lista filmes assistidos pelo usuário autenticado.

## Regras de Negócio

- Login e senha obrigatórios para login e registro.
- Não é permitido registrar filmes assistidos duplicados para o mesmo usuário.
- Apenas usuários autenticados podem registrar e consultar filmes assistidos.

## Aplicação de Conceitos no Código

### Autenticação via JWT
A autenticação é realizada utilizando a biblioteca `jsonwebtoken`. No arquivo `authMiddleware.js`, o token JWT é verificado para autenticar as requisições:
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.verify(token, SECRET);
```
No arquivo `userController.js`, o token é gerado durante o login:
```javascript
const token = jwt.sign({ login: user.login }, SECRET, { expiresIn: '1h' });
```

### Documentação Swagger
A documentação interativa da API é configurada no arquivo `app.js` utilizando `swagger-ui-express`:
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```
Acesse a documentação em `http://localhost:3000/api-docs`.

### Registro de Filmes Assistidos
As rotas para registrar e consultar filmes assistidos estão definidas no arquivo `app.js`:
```javascript
app.post('/filmes-assistidos', authMiddleware, movieController.addWatchedMovie);
app.get('/filmes-assistidos', authMiddleware, movieController.getWatchedMovies);
```
Essas rotas utilizam o middleware de autenticação e são implementadas no `movieController`.

## Testes

Para testar a API, recomenda-se o uso do Supertest e Jest. O arquivo `app.js` pode ser importado diretamente nos testes sem iniciar o servidor.

## Observações

- Os dados são armazenados em memória e serão perdidos ao reiniciar o servidor.
- O projeto está dividido em controllers, services, models, app.js e server.js para facilitar testes e manutenção.

---

Desenvolvido para fins de aprendizado de automação e testes de API.
