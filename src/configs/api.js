import axios from 'axios';
import URL_PRODUCTION from './urlProduction'; //? demo ou app

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
        : URL_PRODUCTION
});

