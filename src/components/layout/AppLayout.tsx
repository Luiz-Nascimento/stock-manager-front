// src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
// 1. Importe o CSS Module
import styles from './AppLayout.module.css' 

const AppLayout = () => {
  return (
    // 2. Use a classe do CSS Module
    <div className={styles.appLayout}>
      <Sidebar />
      {/* 3. Use a classe do CSS Module */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout