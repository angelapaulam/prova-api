import { Trend } from 'k6/metrics';
import faker from 'k6/x/faker';

const generateLoginPayloadTrend = new Trend('generate_login_payload_duration');

export const loginHelpers = {
    generateLoginPayload(login, senha) {
        const start = Date.now();

        const payload = JSON.stringify({
            login,
            senha,
            titulo: faker.movie.movieName() // Adicionando um título gerado pelo faker
        });

        generateLoginPayloadTrend.add(Date.now() - start);

        return payload;
    }
};