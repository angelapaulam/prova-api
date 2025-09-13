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

## Testes

Para testar a API, recomenda-se o uso do Supertest e Jest. O arquivo `app.js` pode ser importado diretamente nos testes sem iniciar o servidor.

## Observações

- Os dados são armazenados em memória e serão perdidos ao reiniciar o servidor.
- O projeto está dividido em controllers, services, models, app.js e server.js para facilitar testes e manutenção.

---

Desenvolvido para fins de aprendizado de automação e testes de API.
