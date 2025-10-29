// src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar' // Vamos criar este componente a seguir

const AppLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* O <Outlet /> é o marcador de posição onde o React Router
            vai renderizar sua página (Dashboard, Produtos, etc.) */}
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout