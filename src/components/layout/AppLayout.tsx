// src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

const AppLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',  // ← ADICIONE
      width: '100%'        // ← ADICIONE
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '2rem',
        overflowY: 'auto',     // ← ADICIONE
        width: '100%',         // ← ADICIONE
        boxSizing: 'border-box' // ← ADICIONE (importante!)
      }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
