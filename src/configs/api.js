import axios from 'axios';

console.log('api -> env: ', process.env.REACT_APP_BASE_URL_PRODUCTION)

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
        : process.env.REACT_APP_BASE_URL_PRODUCTION
});

