import axios from 'axios';


const URL_PRODUCTION = process.env.REACT_APP_URL_PRODUCTION;
console.log("🚀 ~ URL_PRODUCTION:", URL_PRODUCTION)

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
        : URL_PRODUCTION // 'https://demo.gedagro.com.br/api/'
});

