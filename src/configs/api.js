import axios from 'axios';
// import URL_PRODUCTION from './productionUrl'; //? demo ou app

console.log("🚀 ~ ENV:", process.env.NODE_ENV)

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
        : 'https://demo.gedagro.com.br/api/' //URL_PRODUCTION
});