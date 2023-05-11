import axios from 'axios';


export const api = axios.create({

    baseURL: 'http://localhost:3333/api/'

    // baseURL: 'https://demo.gedagro.com.br/api/'
});
