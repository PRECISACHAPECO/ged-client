
import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://demo.gedagro.com.br/api/' //process.env.NEXT_PUBLIC_API_ENDPOINT
});