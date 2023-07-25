import axios from 'axios';
<<<<<<< HEAD
// import URL_PRODUCTION from './productionUrl'; //? demo ou app

console.log("🚀 ~ ENV:", process.env.NODE_ENV)
=======
import URL_PRODUCTION from './productionUrl'; //? demo ou app
console.log("🚀 ~ URL_PRODUCTION:", URL_PRODUCTION)
>>>>>>> d3c319b72bedc60899820f5cd9d34e8bd4d33d56

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
<<<<<<< HEAD
        : 'https://demo.gedagro.com.br/api/' //URL_PRODUCTION
=======
        : URL_PRODUCTION
>>>>>>> d3c319b72bedc60899820f5cd9d34e8bd4d33d56
});