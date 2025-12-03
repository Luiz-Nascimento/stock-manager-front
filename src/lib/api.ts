// src/lib/api.ts
import axios from 'axios';

// Garanta que esta é a porta onde seu back-end Spring Boot está rodando
const api = axios.create({
  baseURL: 'https://stock-manager-luiz-c903789022f1.herokuapp.com'
});

export default api;