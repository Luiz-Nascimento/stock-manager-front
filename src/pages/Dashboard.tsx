// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign, Calendar, XCircle } from 'lucide-react';
import api from '../lib/api';

interface DashboardStats {
  totalProdutos: number;
  quantidadeTotalItens: number;
  valorTotalEstoque: number;
  totalMarcas: number;
  produtosEstoqueBaixo: number;
  produtosEmFalta: number;
  produtosVencidos: number;
  produtosVencendo7Dias: number;
  produtosVencendo30Dias: number;
  valorEmRisco: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div style={{ color: '#e0e0e0', textAlign: 'center', padding: '2rem' }}>
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
        <p>{error || "Erro ao carregar dados"}</p>
      </div>
    );
  }

  return (
    <div style={{ color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Dashboard</h2>
      
      {/* Linha 1: Cards de Métricas Básicas */}
      <div style={gridContainerStyle}>
        
        {/* Total de Produtos */}
        <div style={cardStyle}>
          <Package size={24} color="#3b82f6" />
          <h4 style={cardTitleStyle}>Total de Produtos</h4>
          <p style={cardValueStyle}>{stats.totalProdutos}</p>
        </div>

        {/* Quantidade Total */}
        <div style={cardStyle}>
          <TrendingUp size={24} color="#10b981" />
          <h4 style={cardTitleStyle}>Itens em Estoque</h4>
          <p style={cardValueStyle}>{stats.quantidadeTotalItens}</p>
        </div>

        {/* Valor Total */}
        <div style={cardStyle}>
          <DollarSign size={24} color="#8b5cf6" />
          <h4 style={cardTitleStyle}>Valor Total</h4>
          <p style={cardValueStyle}>R$ {stats.valorTotalEstoque.toFixed(2)}</p>
        </div>

        {/* Total de Marcas */}
        <div style={cardStyle}>
          <Package size={24} color="#06b6d4" />
          <h4 style={cardTitleStyle}>Marcas</h4>
          <p style={cardValueStyle}>{stats.totalMarcas}</p>
        </div>
      </div>

      {/* Linha 2: Cards de Alertas */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2rem' }}>Alertas</h3>
      <div style={gridContainerStyle}>
        
        {/* Estoque Baixo */}
        <div style={stats.produtosEstoqueBaixo > 0 ? warningCardStyle : cardStyle}>
          <AlertTriangle size={24} color={stats.produtosEstoqueBaixo > 0 ? "#facc15" : "#a0a0a0"} />
          <h4 style={{...cardTitleStyle, color: stats.produtosEstoqueBaixo > 0 ? '#b45309' : '#a0a0a0'}}>
            Estoque Baixo
          </h4>
          <p style={{...cardValueStyle, color: stats.produtosEstoqueBaixo > 0 ? '#d97706' : '#e0e0e0'}}>
            {stats.produtosEstoqueBaixo}
          </p>
        </div>

        {/* Em Falta */}
        <div style={stats.produtosEmFalta > 0 ? dangerCardStyle : cardStyle}>
          <XCircle size={24} color={stats.produtosEmFalta > 0 ? "#ef4444" : "#a0a0a0"} />
          <h4 style={{...cardTitleStyle, color: stats.produtosEmFalta > 0 ? '#991b1b' : '#a0a0a0'}}>
            Em Falta
          </h4>
          <p style={{...cardValueStyle, color: stats.produtosEmFalta > 0 ? '#dc2626' : '#e0e0e0'}}>
            {stats.produtosEmFalta}
          </p>
        </div>

        {/* Vencidos */}
        <div style={stats.produtosVencidos > 0 ? dangerCardStyle : cardStyle}>
          <Calendar size={24} color={stats.produtosVencidos > 0 ? "#ef4444" : "#a0a0a0"} />
          <h4 style={{...cardTitleStyle, color: stats.produtosVencidos > 0 ? '#991b1b' : '#a0a0a0'}}>
            Vencidos
          </h4>
          <p style={{...cardValueStyle, color: stats.produtosVencidos > 0 ? '#dc2626' : '#e0e0e0'}}>
            {stats.produtosVencidos}
          </p>
        </div>

        {/* Vencendo em 7 dias */}
        <div style={stats.produtosVencendo7Dias > 0 ? warningCardStyle : cardStyle}>
          <Calendar size={24} color={stats.produtosVencendo7Dias > 0 ? "#facc15" : "#a0a0a0"} />
          <h4 style={{...cardTitleStyle, color: stats.produtosVencendo7Dias > 0 ? '#b45309' : '#a0a0a0'}}>
            Vencendo (7 dias)
          </h4>
          <p style={{...cardValueStyle, color: stats.produtosVencendo7Dias > 0 ? '#d97706' : '#e0e0e0'}}>
            {stats.produtosVencendo7Dias}
          </p>
        </div>
      </div>

      {/* Linha 3: Informações Adicionais */}
      {stats.produtosVencendo30Dias > 0 && (
        <div style={{ ...infoBoxStyle, marginTop: '2rem' }}>
          <p style={{ margin: 0, color: '#fbbf24' }}>
            ⚠️ <strong>{stats.produtosVencendo30Dias}</strong> produtos vencendo nos próximos 30 dias
          </p>
        </div>
      )}

      {stats.valorEmRisco > 0 && (
        <div style={{ ...infoBoxStyle, marginTop: '1rem' }}>
          <p style={{ margin: 0, color: '#ef4444' }}>
            🚨 Valor em risco (produtos vencidos): <strong>R$ {stats.valorEmRisco.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

// Estilos

// NOVO: Container Grid responsivo
const gridContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Magia aqui! 🎯
  gap: '1rem',
  marginBottom: '1rem',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #3a3a3a',
  background: '#242424',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  color: '#e0e0e0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const warningCardStyle: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: '#fffbe6',
  borderColor: '#fde047',
};

const dangerCardStyle: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: '#fee2e2',
  borderColor: '#fca5a5',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  color: '#a0a0a0',
  textTransform: 'uppercase',
  fontWeight: 500,
};

const cardValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
};

const infoBoxStyle: React.CSSProperties = {
  padding: '1rem',
  backgroundColor: '#242424',
  border: '1px solid #3a3a3a',
  borderRadius: '8px',
};

export default Dashboard;
