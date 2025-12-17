import { SharedArray } from 'k6/data';

export function getBaseUrl() {
    return __ENV.BASE_URL || 'http://localhost:3000';
}