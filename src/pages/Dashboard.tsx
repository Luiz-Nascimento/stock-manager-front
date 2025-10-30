// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign, Calendar, XCircle } from 'lucide-react';
import api from '../lib/api';
import styles from './Dashboard.module.css'; 

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
  
  // Helper para aplicar classes condicionais
  const getCardClass = (condition: boolean, style: string) => {
    return `${styles.card} ${condition ? style : ''}`;
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

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.header}>Dashboard</h2>
      
      {/* Linha 1: Cards de Métricas Básicas */}
      <div className={styles.gridContainer}>
        
        {/* Total de Produtos */}
        <div className={styles.card}>
          <Package size={24} color="#3b82f6" />
          <h4 className={styles.cardTitle}>Total de Produtos</h4>
          <p className={styles.cardValue}>{stats.totalProdutos}</p>
        </div>

        {/* Quantidade Total */}
        <div className={styles.card}>
          <TrendingUp size={24} color="#10b981" />
          <h4 className={styles.cardTitle}>Itens em Estoque</h4>
          <p className={styles.cardValue}>{stats.quantidadeTotalItens}</p>
        </div>

        {/* Valor Total */}
        <div className={styles.card}>
          <DollarSign size={24} color="#8b5cf6" />
          <h4 className={styles.cardTitle}>Valor Total</h4>
          <p className={styles.cardValue}>R$ {stats.valorTotalEstoque.toFixed(2)}</p>
        </div>

        {/* Total de Marcas */}
        <div className={styles.card}>
          <Package size={24} color="#06b6d4" />
          <h4 className={styles.cardTitle}>Marcas</h4>
          <p className={styles.cardValue}>{stats.totalMarcas}</p>
        </div>
      </div>

      {/* Linha 2: Cards de Alertas */}
      <h3 className={styles.subHeader}>Alertas</h3>
      <div className={styles.gridContainer}>
        
        {/* Estoque Baixo */}
        <div className={getCardClass(stats.produtosEstoqueBaixo > 0, styles.warningCard)}>
          <AlertTriangle size={24} color={stats.produtosEstoqueBaixo > 0 ? "#facc15" : "#a0a0a0"} />
          <h4 className={styles.cardTitle}>
            Estoque Baixo
          </h4>
          <p className={styles.cardValue}>
            {stats.produtosEstoqueBaixo}
          </p>
        </div>

        {/* Em Falta */}
        <div className={getCardClass(stats.produtosEmFalta > 0, styles.dangerCard)}>
          <XCircle size={24} color={stats.produtosEmFalta > 0 ? "#ef4444" : "#a0a0a0"} />
          <h4 className={styles.cardTitle}>
            Em Falta
          </h4>
          <p className={styles.cardValue}>
            {stats.produtosEmFalta}
          </p>
        </div>

        {/* Vencidos */}
        <div className={getCardClass(stats.produtosVencidos > 0, styles.dangerCard)}>
          <Calendar size={24} color={stats.produtosVencidos > 0 ? "#ef4444" : "#a0a0a0"} />
          <h4 className={styles.cardTitle}>
            Vencidos
          </h4>
          <p className={styles.cardValue}>
            {stats.produtosVencidos}
          </p>
        </div>

        {/* Vencendo em 7 dias */}
        <div className={getCardClass(stats.produtosVencendo7Dias > 0, styles.warningCard)}>
          <Calendar size={24} color={stats.produtosVencendo7Dias > 0 ? "#facc15" : "#a0a0a0"} />
          <h4 className={styles.cardTitle}>
            Vencendo (7 dias)
          </h4>
          <p className={styles.cardValue}>
            {stats.produtosVencendo7Dias}
          </p>
        </div>
      </div>

      {/* Linha 3: Informações Adicionais */}
      {stats.produtosVencendo30Dias > 0 && (
        <div className={`${styles.infoBox} ${styles.infoBoxWarning}`} style={{ marginTop: '2rem' }}>
          <p style={{ margin: 0 }}>
            ⚠️ <strong>{stats.produtosVencendo30Dias}</strong> produtos vencendo nos próximos 30 dias
          </p>
        </div>
      )}

      {stats.valorEmRisco > 0 && (
        <div className={`${styles.infoBox} ${styles.infoBoxDanger}`} style={{ marginTop: '1rem' }}>
          <p style={{ margin: 0 }}>
            🚨 Valor em risco (produtos vencidos): <strong>R$ {stats.valorEmRisco.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;