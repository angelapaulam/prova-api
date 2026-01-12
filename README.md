# Este repositório contém explicações sobre conceitos aplicados na API, incluindo Métricas Personalizadas, Helpers, Autenticação com Token JWT, Documentação Swagger, Testes de Performance(Explicando onde no código cada um dos conceitos foram aplicados para o arquivo `test/k6/capture.test.js`).

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

## Aplicação de Conceitos no Arquivo `capture.test.js`

O arquivo `test/k6/capture.test.js` demonstra o uso de vários conceitos importantes para testes de carga e desempenho utilizando o K6, incluindo a reutilização de um helper importado de outro script JavaScript. Abaixo estão os conceitos aplicados e onde eles aparecem no código:

### Métricas Personalizadas
No início do arquivo, são criadas métricas personalizadas para medir a duração das requisições de login e registro de filmes assistidos:
```javascript
const loginTrend = new Trend('login_duration');
const filmesTrend = new Trend('filmes_duration');
```
Essas métricas são utilizadas para monitorar o desempenho de partes específicas do fluxo de teste.

### Configuração de Carga
A configuração de carga é definida na exportação `options`, onde são especificados os estágios de carga e os thresholds (limites de desempenho):
```javascript
export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'],
        'http_req_failed': ['rate<0.01'],
        'login_duration': ['p(95)<300'],
        'filmes_duration': ['p(95)<400']
    }
};
```
Isso define como o teste será executado e os critérios de sucesso para o desempenho.

### Reutilização de Helpers
O helper `getBaseUrl` é importado para obter a URL base da API:
```javascript
import { getBaseUrl } from './helpers/getBaseUrl.js';
```
Isso promove a reutilização de código e facilita a manutenção.

### Teste de Login
O teste de login é realizado com uma requisição POST, e a duração da requisição é registrada na métrica personalizada `loginTrend`:
```javascript
const resposta1 = http.post(`${baseUrl}/login`, 
    JSON.stringify({
        login: "angela",
        senha: "123456"
    }),
    {
        headers: {
            'Content-Type': 'application/json'
        }
    }
);
loginTrend.add(resposta1.timings.duration);
```
Além disso, o código verifica se o status da resposta é 200 e falha o teste caso contrário.

### Teste de Registro de Filmes Assistidos
Após obter o token de autenticação, uma requisição POST é feita para registrar um filme assistido. A duração da requisição é registrada na métrica `filmesTrend`:
```javascript
const resposta2 = http.post(`${baseUrl}/filmes-assistidos`, 
    JSON.stringify({
        titulo: `Filme-${Date.now()}`,
    }),
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
);
filmesTrend.add(resposta2.timings.duration);
```
O código também verifica se o status da resposta é 201 e falha o teste caso contrário.

### Pausa entre Iterações
Uma pausa de 1 segundo é adicionada entre as iterações para simular um comportamento mais realista:
```javascript
sleep(1);
```

Esses conceitos tornam o teste robusto e abrangente, cobrindo autenticação, registro de dados e monitoramento de desempenho.

## Testes

Para testar a API, recomenda-se o uso do Supertest e Jest. O arquivo `app.js` pode ser importado diretamente nos testes sem iniciar o servidor.

## Observações

- Os dados são armazenados em memória e serão perdidos ao reiniciar o servidor.
- O projeto está dividido em controllers, services, models, app.js e server.js para facilitar testes e manutenção.

---

Desenvolvido para fins de aprendizado e trabalho final de Automação de Testes de Performance em uma API.
