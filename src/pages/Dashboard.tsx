// src/pages/Dashboard.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

// Dados de exemplo (você buscará isso da sua API)
const maisVendidosData = [
  { nome: 'Arroz', vendidos: 150 },
  { nome: 'Feijão', vendidos: 120 },
  { nome: 'Macarrão', vendidos: 90 },
  { nome: 'Óleo', vendidos: 80 },
];

const Dashboard: React.FC = () => {
  const produtosBaixoEstoque = 5; // Exemplo
  const totalProdutos = 124;    // Exemplo

  return (
    <div style={{ color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Dashboard</h2>
      
      {/* Cards de Status */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Card 1: Mais Vendidos */}
        <div style={cardStyle}>
          <TrendingUp size={24} />
          <h4 style={cardTitleStyle}>Mais Vendidos</h4>
          <p style={cardValueStyle}>{maisVendidosData[0].nome}</p>
        </div>
        
        {/* Card 2: Total de Itens */}
        <div style={cardStyle}>
          <Package size={24} />
          <h4 style={cardTitleStyle}>Total de Itens</h4>
          <p style={cardValueStyle}>{totalProdutos} produtos</p>
        </div>

        {/* Card 3: Baixo Estoque (COM ESTILO CORRIGIDO) */}
        <div style={warningCardStyle}>
          <AlertTriangle size={24} color="#facc15" />
          {/* --- MUDANÇA AQUI --- 
              Adicionei um estilo inline para forçar o texto a ser escuro 
          */}
          <h4 style={{...cardTitleStyle, color: '#b45309'}}>Baixo Estoque</h4>
          <p style={{...cardValueStyle, color: '#d97706'}}>
            {produtosBaixoEstoque} itens precisando de reposição
          </p>
        </div>
      </div>

      {/* Gráfico de "produtos mais vendidos" */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Produtos Mais Vendidos</h3>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={maisVendidosData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            
            {/* --- MUDANÇAS NO GRÁFICO --- */}
            
            {/* 1. Cor do texto do Eixo X (Arroz, Feijão...) */}
            <XAxis 
              dataKey="nome" 
              tick={{ fill: '#a0a0a0', fontSize: 12 }} 
              stroke="#3a3a3a"
              tickLine={false}
            />
            
            {/* 2. Cor do texto do Eixo Y (Números) */}
            <YAxis 
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              stroke="#3a3a3a"
              tickLine={false}
            />
            
            {/* 3. Cor do texto da "caixinha" ao passar o mouse */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#242424', borderColor: '#3a3a3a' }}
              labelStyle={{ color: '#e0e0e0' }}
            />
            
            {/* 4. Cor do texto da Legenda ("vendidos") */}
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            
            {/* A cor da barra você pode mudar no 'fill' */}
            <Bar dataKey="vendidos" fill="#8b5cf6" /> 
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- NOVOS OBJETOS DE ESTILO ---

// Estilo de base para os cards
const cardStyle: React.CSSProperties = {
  border: '1px solid #3a3a3a',    // Borda cinza escura
  background: '#242424',        // Fundo cinza escuro (igual sidebar)
  borderRadius: '8px',
  padding: '1.5rem',
  width: '220px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  color: '#e0e0e0', // Texto padrão claro
};

// Estilo para o card de aviso (amarelo)
const warningCardStyle: React.CSSProperties = {
  ...cardStyle, // Herda os estilos do card normal
  backgroundColor: '#fffbe6', // Fundo amarelo claro
  borderColor: '#fde047',     // Borda amarela
};

// Estilos para os textos dos cards
const cardTitleStyle: React.CSSProperties = {
  margin: '0.75rem 0 0.25rem',
  fontSize: '0.9rem',
  color: '#a0a0a0', // Cinza claro
  textTransform: 'uppercase',
};

const cardValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
};

export default Dashboard;