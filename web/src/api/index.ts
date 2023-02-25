import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE ?? import.meta.env.BASE_URL;

export const api = axios.create({ baseURL: `${baseURL}/api/v1` });
