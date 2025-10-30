// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext' // 1. Importe o provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* 2. Envolva o App */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)