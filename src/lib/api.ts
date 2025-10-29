// src/lib/api.ts
import axios from 'axios';

// Garanta que esta é a porta onde seu back-end Spring Boot está rodando
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export default api;