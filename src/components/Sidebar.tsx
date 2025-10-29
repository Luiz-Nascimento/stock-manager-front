// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation();
  
  // Função para verificar se o link está ativo
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{ 
      width: '260px', 
      minHeight: '100vh', 
      background: '#1a1a1a',
      borderRight: '1px solid #2a2a2a',
      color: '#ffffff',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={headerStyle}>
        <Package size={28} color="#3b82f6" />
        <h3 style={titleStyle}>Gerenciador de Estoque</h3>
      </div>
      
      {/* Menu */}
      <ul style={{ 
        listStyle: 'none', 
        padding: '1rem 0', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.25rem',
        margin: 0,
        flex: 1,
      }}>
        <li>
          <Link 
            to="/" 
            style={{
              ...linkStyle,
              ...(isActive('/') ? activeLinkStyle : {})
            }}
            onMouseEnter={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {isActive('/') && <div style={activeIndicator} />}
            <LayoutDashboard size={20} style={{ flexShrink: 0 }} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/produtos" 
            style={{
              ...linkStyle,
              ...(isActive('/produtos') ? activeLinkStyle : {})
            }}
            onMouseEnter={(e) => {
              if (!isActive('/produtos')) {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/produtos')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {isActive('/produtos') && <div style={activeIndicator} />}
            <Package size={20} style={{ flexShrink: 0 }} />
            <span>Produtos</span>
          </Link>
        </li>
      </ul>

      {/* Footer (opcional - pode comentar se não quiser) */}
      <div style={footerStyle}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          v1.0.0
        </div>
      </div>
    </nav>
  )
}

// Estilos
const headerStyle: React.CSSProperties = {
  padding: '1.5rem',
  borderBottom: '1px solid #2a2a2a',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  color: '#e0e0e0',
};

const linkStyle: React.CSSProperties = {
  color: '#a0a0a0',
  textDecoration: 'none',
  padding: '0.875rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderRadius: '0',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  position: 'relative',
  cursor: 'pointer',
};

const activeLinkStyle: React.CSSProperties = {
  backgroundColor: '#2a2a2a',
  color: '#3b82f6',
};

const activeIndicator: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '3px',
  backgroundColor: '#3b82f6',
  borderRadius: '0 2px 2px 0',
};

const footerStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderTop: '1px solid #2a2a2a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default Sidebar
