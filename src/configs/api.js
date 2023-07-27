import axios from 'axios';
<<<<<<< HEAD
import URL_PRODUCTION from './productionUrl'; //? demo ou app

console.log("🚀 ~ ENV:", process.env.NODE_ENV)
=======
// import URL_PRODUCTION from './productionUrl'; //? demo ou app
// console.log("🚀 ~ URL_PRODUCTION:", URL_PRODUCTION)
>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/'
<<<<<<< HEAD
        : 'https://demo.gedagro.com.br/api/' //URL_PRODUCTION
})
=======
        : 'https://demo.gedagro.com.br/api/'
});
>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2
