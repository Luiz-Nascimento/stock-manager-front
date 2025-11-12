// src/lib/api.ts
import axios from 'axios';

// Garanta que esta é a porta onde seu back-end Spring Boot está rodando
const api = axios.create({
  baseURL: 'https://app-stockmanager-api.graybay-87632aed.eastus.azurecontainerapps.io'
});

export default api;