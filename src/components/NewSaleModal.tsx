// src/components/NewSaleModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import api from '../lib/api';
import type { Produto } from '../pages/Produtos'; // Reutiliza tipo
import styles from '../pages/Vendas.module.css'; // Usa o CSS que criamos

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaleSuccess: () => void; // Callback para atualizar a lista pai
}

// Tipo local para o carrinho (visual)
type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
  subtotal: number;
};

const NewSaleModal: React.FC<NewSaleModalProps> = ({ open, onOpenChange, onSaleSuccess }) => {
  // Estados do Formulário
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>('');
  const [quantidadeInput, setQuantidadeInput] = useState<number>(1);
  
  // Estado do Carrinho
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar produtos ao abrir o modal
  useEffect(() => {
    if (open) {
      api.get('/produtos').then(res => {
        setProdutosDisponiveis(res.data);
        if (res.data.length > 0) setProdutoSelecionadoId(res.data[0].id.toString());
      }).catch(err => console.error("Erro ao carregar produtos", err));
      
      // Limpa carrinho
      setCarrinho([]);
      setQuantidadeInput(1);
    }
  }, [open]);

  // Adicionar item ao carrinho
  const handleAddItem = () => {
    const produto = produtosDisponiveis.find(p => p.id.toString() === produtoSelecionadoId);
    if (!produto) return;

    if (quantidadeInput <= 0) {
      alert("A quantidade deve ser maior que zero.");
      return;
    }

    // Verifica estoque visualmente (Backend valida de novo depois)
    if (quantidadeInput > produto.quantidade) {
      alert(`Estoque insuficiente! Apenas ${produto.quantidade} unidades disponíveis.`);
      return;
    }

    // Verifica se já existe no carrinho para somar
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    if (itemExistente) {
        const novaQtd = itemExistente.quantidade + quantidadeInput;
        if (novaQtd > produto.quantidade) {
            alert("Quantidade total excede o estoque!");
            return;
        }
        setCarrinho(prev => prev.map(item => 
            item.produto.id === produto.id 
            ? { ...item, quantidade: novaQtd, subtotal: novaQtd * item.produto.preco }
            : item
        ));
    } else {
        const novoItem: ItemCarrinho = {
            produto,
            quantidade: quantidadeInput,
            subtotal: quantidadeInput * produto.preco
        };
        setCarrinho([...carrinho, novoItem]);
    }
  };

  const handleRemoveItem = (id: number) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== id));
  };

  const valorTotalVenda = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const handleFinalizarVenda = async () => {
    if (carrinho.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Monta o JSON exatamente como o PedidoRequest do Java espera
      const payload = {
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      };

      await api.post('/pedidos', payload);
      
      alert("Venda realizada com sucesso!");
      onSaleSuccess(); // Atualiza lista pai
      onOpenChange(false); // Fecha modal
    } catch (error: any) {
      console.error("Erro na venda:", error);
      // Tenta pegar a mensagem de erro do backend (ex: "Estoque insuficiente")
      const msg = error.response?.data?.message || "Erro ao realizar venda.";
      alert("Erro: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent" style={{ maxWidth: '700px' }}>
          
          <Dialog.Title className="DialogTitle" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={24} /> Nova Venda
          </Dialog.Title>
          
          <div className={styles.posContainer}>
            {/* Área de Adição */}
            <div className={styles.addItemRow}>
              <div style={{ flex: 1 }}>
                <label className="Label">Produto</label>
                <select 
                  className="Input"
                  value={produtoSelecionadoId}
                  onChange={(e) => setProdutoSelecionadoId(e.target.value)}
                >
                  {produtosDisponiveis.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (R$ {p.preco.toFixed(2)}) - Estoque: {p.quantidade}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: '100px' }}>
                <label className="Label">Qtd.</label>
                <input 
                  type="number" 
                  className="Input"
                  min="1"
                  value={quantidadeInput}
                  onChange={(e) => setQuantidadeInput(parseInt(e.target.value))}
                />
              </div>
              <button type="button" onClick={handleAddItem} className={styles.addButton}>
                <Plus size={20} />
              </button>
            </div>

            {/* Tabela do Carrinho */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className={styles.cartTable}>
                <thead>
                  <tr>
                    <th className={styles.cartHeader}>Produto</th>
                    <th className={styles.cartHeader}>Qtd</th>
                    <th className={styles.cartHeader}>Unitário</th>
                    <th className={styles.cartHeader}>Subtotal</th>
                    <th className={styles.cartHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCart}>Carrinho vazio</td>
                    </tr>
                  ) : (
                    carrinho.map(item => (
                      <tr key={item.produto.id} className={styles.cartRow}>
                        <td>{item.produto.nome}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {item.produto.preco.toFixed(2)}</td>
                        <td>R$ {item.subtotal.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => handleRemoveItem(item.produto.id)} className={styles.removeBtn}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé e Total */}
            <div className={styles.totalRow}>
              <span>Total da Venda:</span>
              <span>R$ {valorTotalVenda.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Dialog.Close asChild>
                <button className="Button secondary" disabled={isSubmitting}>Cancelar</button>
              </Dialog.Close>
              <button 
                className="Button primary" 
                onClick={handleFinalizarVenda} 
                disabled={isSubmitting || carrinho.length === 0}
                style={{ backgroundColor: '#10b981' }}
              >
                {isSubmitting ? 'Processando...' : 'Finalizar Venda (Baixar Estoque)'}
              </button>
            </div>
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

export default NewSaleModal;