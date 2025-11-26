// src/pages/Vendas.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, DollarSign, Layers, Eye } from 'lucide-react';
import api from '../lib/api';
import styles from './Vendas.module.css';
import NewSaleModal from '../components/NewSaleModal';
import SaleDetailsModal from '../components/SaleDetailsModal.tsx';
// IMPORTAÇÃO NOVA (Do arquivo de tipos)
import type { Pedido } from '../types'; 

const Vendas: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVendas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedidos');
      const sorted = response.data.sort((a: Pedido, b: Pedido) => b.id - a.id);
      setPedidos(sorted);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const handleOpenDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Relatório de Vendas</h2>
        <button 
          className={styles.addButtonStyle} 
          onClick={() => setIsNewSaleModalOpen(true)}
        >
          <ShoppingBag size={18} />
          Nova Venda
        </button>
      </div>

      {loading ? (
        <p>Carregando histórico...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thStyle}>ID</th>
              <th className={styles.thStyle}><Calendar size={14} style={{marginRight: 5}}/> Data</th>
              <th className={styles.thStyle}><Layers size={14} style={{marginRight: 5}}/> Itens</th>
              <th className={styles.thStyle}><DollarSign size={14} style={{marginRight: 5}}/> Total</th>
              <th className={styles.thStyle} style={{textAlign: 'center'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td className={styles.tdStyle}>#{pedido.id}</td>
                <td className={styles.tdStyle}>{pedido.dataPedido}</td>
                <td className={styles.tdStyle}>{pedido.quantidadeTotalItens} unid.</td>
                <td className={styles.tdStyle} style={{ fontWeight: 'bold', color: '#10b981' }}>
                  R$ {pedido.valorTotal.toFixed(2)}
                </td>
                <td className={styles.tdStyle} style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleOpenDetails(pedido)}
                    className="Button secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', gap: '5px', alignItems: 'center' }}
                  >
                    <Eye size={16} /> Detalhes
                  </button>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <NewSaleModal 
        open={isNewSaleModalOpen} 
        onOpenChange={setIsNewSaleModalOpen} 
        onSaleSuccess={fetchVendas} 
      />

      <SaleDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        pedido={selectedPedido}
      />
    </div>
  );
};

export default Vendas;