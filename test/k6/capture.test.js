import http from 'k6/http'
import { check, sleep, fail } from 'k6'
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { Trend } from 'k6/metrics';

const loginTrend = new Trend('login_duration');
const filmesTrend = new Trend('filmes_duration');

export const options = {
    stages: [
        { duration: '10s', target: 10 }, // Ramp-up to 10 users
        { duration: '20s', target: 10 }, // Stay at 10 users
        { duration: '10s', target: 0 }   // Ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'],
        'http_req_failed': ['rate<0.01'],
        'login_duration': ['p(95)<300'],
        'filmes_duration': ['p(95)<400']
    }
};

export default function() {
    const baseUrl = getBaseUrl();

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

    if (!check(resposta1, {
        'status code é 200': (r) => r.status === 200
    })) {
        console.error(`Login falhou: ${resposta1.body}`);
        fail('Falha no login');
    }

    const token = resposta1.json('token');

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

    if (!check(resposta2, {
        'status code é 201': (r) => r.status === 201
    })) {
        console.error(`Erro ao registrar filme: ${resposta2.body}`);
        fail('Falha ao registrar filme');
    }

    sleep(1);
}