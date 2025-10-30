// src/pages/Produtos.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react'; // Importar Loader2 (ou outro ícone de loading)
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import api from '../lib/api';
import styles from './Produtos.module.css';

// ... (Tipos Produto, NewProductData, UpdateProductData) ...
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
  // 1. NOVO ESTADO: ID do produto sendo deletado
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  useEffect(() => {
    // ... (fetchProdutos não muda) ...
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

  // --- Funções de API ---
  const handleCreateProduct = async (data: NewProductData) => {
    // ... (lógica não muda) ...
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post('/produtos', data);
      setProdutos(prev => [...prev, response.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id: number, data: UpdateProductData) => {
     // ... (lógica não muda) ...
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.put(`/produtos/${id}`, data);
      setProdutos(prev => prev.map(p => (p.id === id ? response.data : p)));
      setIsEditModalOpen(false);
      setProdutoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao ATUALIZAR produto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. ATUALIZAR HANDLE DELETE
  const handleDeletar = async (id: number) => {
    // Não iniciar novo delete se um já estiver em andamento
    if (isSubmitting || deletingProductId !== null) return;

    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }
    setIsSubmitting(true); // Ainda desabilita outros botões
    setDeletingProductId(id); // Marca qual ID está sendo deletado

    try {
      await api.delete(`/produtos/${id}`);
      // Remove o produto da lista APENAS APÓS sucesso da API
      setProdutos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      // TODO: Mostrar feedback de erro
    } finally {
      setIsSubmitting(false); // Reabilita outros botões
      setDeletingProductId(null); // Limpa o ID em deleção
    }
  };


  // --- Funções de controle do Modal (não mudam) ---
  const handleAbrirModalEdicao = (produto: Produto) => {
    if (isSubmitting || deletingProductId !== null) return;
    setProdutoEmEdicao(produto);
    setIsEditModalOpen(true);
  };

  const handleAbrirModalAdicao = () => {
    if (isSubmitting || deletingProductId !== null) return;
    setIsAddModalOpen(true);
  };

  // --- Renderização ---
  return (
    <div className={styles.pageContainer}>
      {/* ... (Header não muda) ... */}
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <button
          onClick={handleAbrirModalAdicao}
          className={styles.addButtonStyle}
          // Desabilitar se estiver submetendo OU deletando
          disabled={isSubmitting || deletingProductId !== null}
        >
          <PlusCircle size={18} />
          {isSubmitting ? 'Aguarde...' : 'Adicionar Produto'}
        </button>
      </div>


      <table className={styles.table}>
        {/* ... (thead não muda) ... */}
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
          {produtos.map((produto) => {
            // 3. Verifica se esta linha está sendo deletada
            const isDeleting = deletingProductId === produto.id;
            return (
              // Aplica uma classe ou estilo inline se estiver deletando
              <tr
                key={produto.id}
                style={{ opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.3s ease-out' }} // Exemplo com opacidade
                // Ou adicione uma classe: className={isDeleting ? styles.deletingRow : ''}
              >
                <td className={styles.tdStyle}>{produto.nome}</td>
                <td className={styles.tdStyle}>{produto.marca}</td>
                <td className={styles.tdStyle}>R$ {produto.preco.toFixed(2)}</td>
                <td className={styles.tdStyle}>{produto.quantidade}</td>
                <td className={styles.tdStyle}>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
                <td className={styles.tdStyle}>
                  {/* Mostrar ícone de loading OU os botões */}
                  {isDeleting ? (
                    <Loader2 size={16} className={styles.spinner} /> // Adicione uma classe CSS para animação de giro
                  ) : (
                    <>
                      <button
                        className={styles.iconButtonStyle}
                        onClick={() => handleAbrirModalEdicao(produto)}
                        // Desabilitar se estiver submetendo OU deletando QUALQUER item
                        disabled={isSubmitting || deletingProductId !== null}
                        aria-label={`Editar ${produto.nome}`}
                      >
                        <Edit size={16} color="#3b82f6" />
                      </button>
                      <button
                        className={styles.iconButtonStyle}
                        onClick={() => handleDeletar(produto.id)}
                         // Desabilitar se estiver submetendo OU deletando QUALQUER item
                        disabled={isSubmitting || deletingProductId !== null}
                        aria-label={`Deletar ${produto.nome}`}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ... (Modais não mudam, mas note que `disabled` neles é controlado por `isSubmitting`) ... */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen} // Simplificado na resposta anterior
        onSave={handleCreateProduct}
        isSubmitting={isSubmitting}
      />
      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={(open) => { // Simplificado na resposta anterior
            if (isSubmitting && !open) return;
            if (!open) setProdutoEmEdicao(null);
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