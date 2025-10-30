// src/pages/Produtos.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import api from '../lib/api';
import styles from './Produtos.module.css';

export type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  validade: string;
};

export type NewProductData = Omit<Produto, 'id'>;
export type UpdateProductData = Omit<Produto, 'id' | 'validade'>;

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

  // --- Funções de API (Mantêm a lógica isSubmitting) ---
  const handleCreateProduct = async (data: NewProductData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post('/produtos', data);
      setProdutos(prev => [...prev, response.data]);
      setIsAddModalOpen(false); // Fechar SÓ no sucesso
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // TODO: Mostrar feedback de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id: number, data: UpdateProductData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.put(`/produtos/${id}`, data);
      setProdutos(prev => prev.map(p => (p.id === id ? response.data : p)));
      setIsEditModalOpen(false); // Fechar SÓ no sucesso
      setProdutoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao ATUALIZAR produto:", error);
       // TODO: Mostrar feedback de erro
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleDeletar = async (id: number) => {
    if (isSubmitting) return;
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }
    setIsSubmitting(true);
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
       // TODO: Mostrar feedback de erro
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Funções de Abertura (Simples) ---

  const handleAbrirModalEdicao = (produto: Produto) => {
    if (isSubmitting) return;
    setProdutoEmEdicao(produto);
    setIsEditModalOpen(true);
  };

  const handleAbrirModalAdicao = () => {
    if (isSubmitting) return;
    setIsAddModalOpen(true);
  };

  // --- Renderização ---
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <button
          onClick={handleAbrirModalAdicao}
          className={styles.addButtonStyle}
          disabled={isSubmitting}
        >
          <PlusCircle size={18} />
          {isSubmitting ? 'Aguarde...' : 'Adicionar Produto'}
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thStyle}>Nome</th>
            <th className={styles.thStyle}>Marca</th>
            <th className={styles.thStyle}>Preço</th>
            <th className={styles.thStyle}>Qtd.</th>
            <th className={styles.thStyle}>Validade</th>
            <th className={styles.thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td className={styles.tdStyle}>{produto.nome}</td>
              <td className={styles.tdStyle}>{produto.marca}</td>
              <td className={styles.tdStyle}>R$ {produto.preco.toFixed(2)}</td>
              <td className={styles.tdStyle}>{produto.quantidade}</td>
              <td className={styles.tdStyle}>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
              <td className={styles.tdStyle}>
                <button
                  className={styles.iconButtonStyle}
                  onClick={() => handleAbrirModalEdicao(produto)}
                  disabled={isSubmitting}
                  aria-label={`Editar ${produto.nome}`}
                >
                  <Edit size={16} color="#3b82f6" />
                </button>
                <button
                  className={styles.iconButtonStyle}
                  onClick={() => handleDeletar(produto.id)}
                  disabled={isSubmitting}
                  aria-label={`Deletar ${produto.nome}`}
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* *** MUDANÇA PRINCIPAL AQUI *** */}
      <AddProductModal
        open={isAddModalOpen}
        // Passar o setter diretamente para o Radix controlar
        onOpenChange={setIsAddModalOpen}
        onSave={handleCreateProduct}
        isSubmitting={isSubmitting}
      />

      <EditProductModal
        open={isEditModalOpen}
        // Passar uma função que atualiza o estado E limpa produtoEmEdicao
        onOpenChange={(open) => {
            // Se estiver a tentar fechar enquanto submete, ignorar (opcional, pois botões internos estarão disabled)
            if (isSubmitting && !open) return;

            // Se está a fechar, limpar o estado do produto em edição
            if (!open) {
                setProdutoEmEdicao(null);
            }
            // Atualizar o estado de abertura/fecho
            setIsEditModalOpen(open);
        }}
        onSave={handleUpdateProduct}
        produtoToEdit={produtoEmEdicao}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Produtos;