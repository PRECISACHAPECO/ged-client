import axios from 'axios';
<<<<<<< HEAD
import URL_PRODUCTION from './productionUrl'; //? demo ou app

console.log("🚀 ~ ENV:", process.env.NODE_ENV)

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
        : 'https://demo.gedagro.com.br/api/' //URL_PRODUCTION
})
=======

export const api = axios.create({
    baseURL: 'https://demo.gedagro.com.br/api/'

    // baseURL: 'http://localhost:3333/api/'
});
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
