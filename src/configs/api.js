import axios from 'axios';

export const api = axios.create({
    // baseURL: 'https://demo.gedagro.com.br/api/'

    baseURL: 'http://localhost:3333/api/'
});