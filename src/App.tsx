// src/App.tsx
import { Routes, Route } from 'react-router-dom'

// 1. Importe os componentes das suas páginas
// (Estou assumindo que você os copiou para 'src/pages/')
import Dashboard from './pages/Dashboard'
import Produtos from './pages/Produtos'
// Importe as outras páginas aqui...
// import Relatorios from './pages/Relatorios'
// import Catalogo from './pages/Catalogo'

// 2. (Opcional, mas MUITO recomendado) Importe um layout
import AppLayout from './components/layout/AppLayout'


function App() {
  // 3. Substitua o conteúdo antigo do App por suas rotas
  return (
    <Routes>
      {/* Isso cria um "layout" (com menu lateral, etc.) 
        e todas as páginas são exibidas dentro dele 
      */}
      <Route path="/" element={<AppLayout />}>

        {/* 'index' significa que esta é a página padrão para a rota "/" */}
        <Route index element={<Dashboard />} />

        {/* As outras páginas */}
        <Route path="produtos" element={<Produtos />} />
        
        {/* Adicione suas outras rotas aqui */}
        {/* <Route path="relatorios" element={<Relatorios />} /> */}
        {/* <Route path="catalogo" element={<Catalogo />} /> */}
        
      </Route>
    </Routes>
  )
}

export default App