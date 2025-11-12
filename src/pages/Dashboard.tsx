// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
// 1. Importe o Link
import { Link } from 'react-router-dom'; 
import { Package, TrendingUp, AlertTriangle, DollarSign, Calendar, XCircle } from 'lucide-react';
import api from '../lib/api';
import styles from './Dashboard.module.css'; 

// ... (interface DashboardStats não muda) ...
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
    // ... (fetchDashboardStats não muda) ...
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
  
  const getCardClass = (condition: boolean, style: string) => {
    return `${styles.card} ${condition ? style : ''}`;
  };

  // 2. Helper para criar o Link (evita repetição)
  // Envolve o card em um Link se a contagem for > 0
  const renderAlertCard = (
    to: string, 
    count: number, 
    style: string, 
    icon: React.ReactNode, 
    title: string
  ) => {
    const cardContent = (
      <>
        {icon}
        <h4 className={styles.cardTitle}>{title}</h4>
        <p className={styles.cardValue}>{count}</p>
      </>
    );

    // Só torna clicável se a contagem for maior que zero
    if (count > 0) {
      return (
        <Link to={`/produtos?filtro=${to}`} className={getCardClass(true, style)}>
          {cardContent}
        </Link>
      );
    }

    // Se a contagem for 0, não é clicável
    return <div className={getCardClass(false, '')}>{cardContent}</div>;
  };


  if (loading) {
    return (
      <div className={styles.loadingBlock}>
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.errorBlock}>
        <p>{error || "Erro ao carregar dados"}</p>
      </div>
    );
  }

  // Isso é necessário para o TypeScript ter certeza que stats não é nulo aqui
  if (!stats) return null; 

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.header}>Dashboard</h2>
      
      {/* Linha 1: Cards de Métricas Básicas (Não mudam) */}
      <div className={styles.gridContainer}>
        {/* ... (Cards de Total de Produtos, Itens, Valor, Marcas ficam iguais) ... */}
        <div className={styles.card}>
          <Package size={24} color="#3b82f6" />
          <h4 className={styles.cardTitle}>Total de Produtos</h4>
          <p className={styles.cardValue}>{stats.totalProdutos}</p>
        </div>
        <div className={styles.card}>
          <TrendingUp size={24} color="#10b981" />
          <h4 className={styles.cardTitle}>Itens em Estoque</h4>
          <p className={styles.cardValue}>{stats.quantidadeTotalItens}</p>
        </div>
        <div className={styles.card}>
          <DollarSign size={24} color="#8b5cf6" />
          <h4 className={styles.cardTitle}>Valor Total</h4>
          <p className={styles.cardValue}>R$ {stats.valorTotalEstoque.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <Package size={24} color="#06b6d4" />
          <h4 className={styles.cardTitle}>Marcas</h4>
          <p className={styles.cardValue}>{stats.totalMarcas}</p>
        </div>
      </div>

      {/* Linha 2: Cards de Alertas (AGORA SÃO CLICÁVEIS) */}
      <h3 className={styles.subHeader}>Alertas (clicáveis)</h3>
      <div className={styles.gridContainer}>
        
        {/* Estoque Baixo */}
        {renderAlertCard(
          "ESTOQUE_BAIXO",
          stats.produtosEstoqueBaixo,
          styles.warningCard,
          <AlertTriangle size={24} color={stats.produtosEstoqueBaixo > 0 ? "#facc15" : "#a0a0a0"} />,
          "Estoque Baixo"
        )}

        {/* Em Falta */}
        {renderAlertCard(
          "EM_FALTA",
          stats.produtosEmFalta,
          styles.dangerCard,
          <XCircle size={24} color={stats.produtosEmFalta > 0 ? "#ef4444" : "#a0a0a0"} />,
          "Em Falta"
        )}

        {/* Vencidos */}
        {renderAlertCard(
          "VENCIDOS",
          stats.produtosVencidos,
          styles.dangerCard,
          <Calendar size={24} color={stats.produtosVencidos > 0 ? "#ef4444" : "#a0a0a0"} />,
          "Vencidos"
        )}

        {/* Vencendo em 7 dias */}
        {renderAlertCard(
          "VENCENDO_7_DIAS",
          stats.produtosVencendo7Dias,
          styles.warningCard,
          <Calendar size={24} color={stats.produtosVencendo7Dias > 0 ? "#facc15" : "#a0a0a0"} />,
          "Vencendo (7 dias)"
        )}
      </div>

      {/* ... (Resto do Dashboard não muda) ... */}
    </div>
  );
};

export default Dashboard;