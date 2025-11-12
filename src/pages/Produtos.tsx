// src/pages/Produtos.tsx
import React, { useState, useEffect, useMemo } from 'react'; // 1. Importar useMemo
import { Edit, Trash2, PlusCircle, Loader2, Search } from 'lucide-react'; // 2. Importar Search
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import api from '../lib/api';
import styles from './Produtos.module.css';

// ... (Tipos Produto, NewProductData, UpdateProductData não mudam) ...
export type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  validade: string;
  categoria: string;
};
export type NewProductData = Omit<Produto, 'id'>;
export type UpdateProductData = Omit<Produto, 'id' | 'validade'>;

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  
  // 3. NOVO ESTADO PARA A BUSCA
  const [termoBusca, setTermoBusca] = useState('');

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

  // ... (Funções de API não mudam) ...
  const handleCreateProduct = async (data: NewProductData) => {
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
  const handleDeletar = async (id: number) => {
    if (isSubmitting || deletingProductId !== null) return;
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }
    setIsSubmitting(true);
    setDeletingProductId(id);
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    } finally {
      setIsSubmitting(false);
      setDeletingProductId(null);
    }
  };
  const handleAbrirModalEdicao = (produto: Produto) => {
    if (isSubmitting || deletingProductId !== null) return;
    setProdutoEmEdicao(produto);
    setIsEditModalOpen(true);
  };
  const handleAbrirModalAdicao = () => {
    if (isSubmitting || deletingProductId !== null) return;
    setIsAddModalOpen(true);
  };

  // 4. LÓGICA DE FILTRAGEM
  // useMemo evita que o filtro rode a cada renderização, só quando produtos ou termoBusca mudam
  const produtosFiltrados = useMemo(() => {
    const buscaLower = termoBusca.toLowerCase();
    
    if (!buscaLower) {
      return produtos; // Retorna todos se a busca estiver vazia
    }

    return produtos.filter(produto => {
      return (
        produto.nome.toLowerCase().includes(buscaLower) ||
        produto.marca.toLowerCase().includes(buscaLower) ||
        produto.categoria.toLowerCase().includes(buscaLower)
      );
    });
  }, [produtos, termoBusca]);


  // --- Renderização ---
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <button
          onClick={handleAbrirModalAdicao}
          className={styles.addButtonStyle}
          disabled={isSubmitting || deletingProductId !== null}
        >
          <PlusCircle size={18} />
          {isSubmitting ? 'Aguarde...' : 'Adicionar Produto'}
        </button>
      </div>

      {/* 5. CAMPO DE BUSCA ADICIONADO AQUI */}
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text"
          placeholder="Buscar por nome, marca ou categoria..."
          className={styles.searchInput}
          value={termoBusca}
          onChange={e => setTermoBusca(e.target.value)}
          disabled={isSubmitting || deletingProductId !== null}
        />
      </div>


      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thStyle}>Nome</th>
            <th className={styles.thStyle}>Marca</th>
            <th className={styles.thStyle}>Categoria</th>
            <th className={styles.thStyle}>Preço</th>
            <th className={styles.thStyle}>Qtd.</th>
            <th className={styles.thStyle}>Validade</th>
            <th className={styles.thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* 6. Mapeia os PRODUTOS FILTRADOS em vez da lista completa */}
          {produtosFiltrados.map((produto) => {
            const isDeleting = deletingProductId === produto.id;
            return (
              <tr
                key={produto.id}
                style={{ opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.3s ease-out' }}
              >
                <td className={styles.tdStyle}>{produto.nome}</td>
                <td className={styles.tdStyle}>{produto.marca}</td>
                <td className={styles.tdStyle}>{produto.categoria}</td>
                <td className={styles.tdStyle}>R$ {produto.preco.toFixed(2)}</td>
                <td className={styles.tdStyle}>{produto.quantidade}</td>
                <td className={styles.tdStyle}>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
                <td className={styles.tdStyle}>
                  {isDeleting ? (
                    <Loader2 size={16} className={styles.spinner} />
                  ) : (
                    <>
                      <button
                        className={styles.iconButtonStyle}
                        onClick={() => handleAbrirModalEdicao(produto)}
                        disabled={isSubmitting || deletingProductId !== null}
                        aria-label={`Editar ${produto.nome}`}
                      >
                        <Edit size={16} color="#3b82f6" />
                      </button>
                      <button
                        className={styles.iconButtonStyle}
                        onClick={() => handleDeletar(produto.id)}
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
      
      {/* Exibe mensagem se o filtro não retornar nada */}
      {produtosFiltrados.length === 0 && termoBusca.length > 0 && (
        <p className={styles.emptySearch}>Nenhum produto encontrado para "{termoBusca}".</p>
      )}

      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleCreateProduct}
        isSubmitting={isSubmitting}
      />
      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
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