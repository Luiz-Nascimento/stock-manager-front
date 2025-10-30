// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Moon, Sun } from 'lucide-react' // Importe Moon e Sun
import { useTheme } from '../contexts/ThemeContext' // Importe o hook do tema
import styles from './Sidebar.module.css' // Importe o CSS Module

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // Use o hook do tema

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Função para classes dinâmicas
  const getLinkClassName = (path: string) => {
    return `${styles.link} ${isActive(path) ? styles.linkActive : ''}`
  }

  return (
    <nav className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <Package size={28} color="#3b82f6" />
        <h3 className={styles.title}>Gerenciador de Estoque</h3>
      </div>
      
      {/* Menu */}
      <ul className={styles.menu}>
        <li>
          <Link 
            to="/" 
            className={getLinkClassName('/')}
          >
            {isActive('/') && <div className={styles.activeIndicator} />}
            <LayoutDashboard size={20} style={{ flexShrink: 0 }} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/produtos" 
            className={getLinkClassName('/produtos')}
          >
            {isActive('/produtos') && <div className={styles.activeIndicator} />}
            <Package size={20} style={{ flexShrink: 0 }} />
            <span>Produtos</span>
          </Link>
        </li>
      </ul>

      {/* Footer com o botão de toggle */}
      <div className={styles.footer}>
        <button onClick={toggleTheme} className={styles.toggleButton}>
          {theme === 'dark' ? 
            <Sun size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> : 
            <Moon size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          }
          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        <div className={styles.footerVersion}>
          v1.0.0
        </div>
      </div>
    </nav>
  )
}

export default Sidebar