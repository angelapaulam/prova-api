const request = require('supertest');
const { expect } = require('chai')

describe('login', () => {
    it('deve retornar erro de usuario ou senha incorretos', async () => {
        const resposta = await request('http://localhost:3000')
            .post('/login')
            .send({
                "login": "angela",
                "senha": "1234567"
            })
        expect(resposta.status).to.be.equal(401)
    })
})
