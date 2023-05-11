import axios from 'axios';

export const api = axios.create({
<<<<<<< HEAD

    baseURL: 'http://localhost:3333/api/'

    // baseURL: 'https://demo.gedagro.com.br/api/'
});
=======
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/api/' // URL do backend local
        : 'https://demo.gedagro.com.br/api/' // URL do backend de produção
});
>>>>>>> b82d557dac8616599e7b77b7443f75ff982616d9
