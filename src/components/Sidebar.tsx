// src/components/Sidebar.tsx
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <nav style={{ 
      width: '200px', 
      height: '100vh', 
      // --- MUDANÇAS AQUI ---
      background: '#242424', // Cor escura para combinar
      borderRight: '1px solid #3a3a3a', // Borda mais escura
      color: '#ffffff', // Deixa o texto "Gerenciador" branco
      padding: '1rem',
      // --- FIM DAS MUDANÇAS ---
    }}>
      <h3 style={{ paddingLeft: '0.5rem' }}>Gerenciador</h3>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <li>
          <Link to="/" style={linkStyle}>Dashboard</Link>
        </li>
        <li>
          <Link to="/produtos" style={linkStyle}>Produtos</Link>
        </li>
        {/* <li>
          <Link to="/relatorios" style={linkStyle}>Relatórios</Link>
        </li> 
        */}
      </ul>
    </nav>
  )
}

// Adicionei um objeto de estilo para os links para garantir
const linkStyle: React.CSSProperties = {
  color: '#e0e0e0', // Um cinza-claro para o texto do link
  textDecoration: 'none',
  padding: '0.5rem',
  display: 'block', // Faz o link ocupar mais espaço
  borderRadius: '4px'
}
// OBS: Você pode adicionar um :hover depois usando CSS
// .link:hover { background: '#333' }

export default Sidebar