import axios from 'axios';

console.log("env", process.env.NEXT_PUBLIC_API_URL);

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : 'https://demo.gedagro.com.br/api/'
});
