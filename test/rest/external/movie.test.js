const request = require('supertest');
const { expect } = require('chai')

describe('movie', () => {
    before(async () => {
        const resposta = await request('http://localhost:3000')
            .post('/login')
            .send({
                "login": "angela",
                "senha": "123456"
            })
        expect(resposta.status).to.be.equal(200)
        token = resposta.body.token

    })
    it('Cadastrar um filme', async () => {
        const resposta = await request('http://localhost:3000')
            .post('/filmes-assistidos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "titulo": "Batman",
            })
        expect(resposta.status).to.be.equal(201)
        expect(resposta.body.mensagem).to.be.equal('Filme registrado como assistido.')
    }
    )
})
