// src/components/SaleDetailsModal.tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Receipt, Calendar, Package } from 'lucide-react';
import styles from '../pages/Vendas.module.css';
// CORREÇÃO: Importa do arquivo de tipos independente
import type { Pedido } from '../types'; 

interface SaleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido | null;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ open, onOpenChange, pedido }) => {
  if (!pedido) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent" style={{ maxWidth: '600px' }}>
          
          <Dialog.Title className="DialogTitle" style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <Receipt size={24} color="#3b82f6" /> Detalhes da Venda #{pedido.id}
          </Dialog.Title>

          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={16} /> 
                <strong>Data:</strong> {pedido.dataPedido}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Package size={16} /> 
                <strong>Total Itens:</strong> {pedido.quantidadeTotalItens}
              </div>
            </div>

            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th className={styles.cartHeader}>Produto</th>
                  <th className={styles.cartHeader} style={{ textAlign: 'center' }}>Qtd</th>
                  <th className={styles.cartHeader} style={{ textAlign: 'right' }}>Unitário</th>
                  <th className={styles.cartHeader} style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedido.vendas.map((item) => (
                  <tr key={item.id} className={styles.cartRow}>
                    <td>
                      <span style={{ display: 'block', fontWeight: 500 }}>{item.nomeProduto}</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>ID: {item.idProduto}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                    <td style={{ textAlign: 'right' }}>R$ {item.precoUnitario.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>R$ {item.precoTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totalRow} style={{ marginTop: '1.5rem' }}>
              <span>Valor Total da Nota:</span>
              <span style={{ color: '#10b981', fontSize: '1.4rem' }}>
                R$ {pedido.valorTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Dialog.Close asChild>
              <button className="Button primary">Fechar</button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Fechar">
              <X size={16} />
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SaleDetailsModal;