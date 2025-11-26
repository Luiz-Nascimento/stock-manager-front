// src/App.tsx
import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Produtos from './pages/Produtos'
// 1. Importe a nova página de Vendas
import Vendas from './pages/Vendas' 

import AppLayout from './components/layout/AppLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<Produtos />} />
        
        {/* 2. Adicione a nova rota aqui */}
        <Route path="vendas" element={<Vendas />} />
        
      </Route>
    </Routes>
  )
}

export default App