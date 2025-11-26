// src/pages/Produtos.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { Edit, Trash2, PlusCircle, Loader2, Search } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import api from '../lib/api';
import styles from './Produtos.module.css';

// ATUALIZAÇÃO 1: Tipagem atualizada para refletir o backend (validade opcional + garantia)
export type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  categoria: string;
  // Agora opcionais e podem ser nulos
  validade?: string | null;
  garantiaMeses?: number | null;
};

// Removemos 'validade' do Omit para permitir o envio correto no Create
export type NewProductData = Omit<Produto, 'id'>;
// Atualização agora aceita tudo (exceto ID) para permitir editar a validade/garantia
export type UpdateProductData = Omit<Produto, 'id'>;

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const [searchParams] = useSearchParams();
  const filtroUrl = searchParams.get('filtro');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        let url = '/produtos';
        
        if (filtroUrl) {
          url = `/produtos?filtro=${filtroUrl}`;
        }
        
        const response = await api.get(url);
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    
    fetchProdutos();
  }, [filtroUrl]);

  const handleCreateProduct = async (data: NewProductData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post('/produtos', data);
      if (!filtroUrl) {
        setProdutos(prev => [...prev, response.data]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Verifique os dados.");
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
      alert("Erro ao atualizar produto.");
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

  const produtosFiltrados = useMemo(() => {
    const buscaLower = termoBusca.toLowerCase();
    
    if (filtroUrl) {
      return produtos;
    }

    if (!buscaLower) {
      return produtos; 
    }
    return produtos.filter(produto => {
      return (
        produto.nome.toLowerCase().includes(buscaLower) ||
        produto.marca.toLowerCase().includes(buscaLower) ||
        produto.categoria.toLowerCase().includes(buscaLower)
      );
    });
  }, [produtos, termoBusca, filtroUrl]);

  const getTituloPagina = () => {
    if (!filtroUrl) return "Lista de Produtos";
    switch (filtroUrl) {
      case "VENCIDOS": return "Produtos Vencidos";
      case "VENCENDO_7_DIAS": return "Produtos Vencendo em 7 Dias";
      case "ESTOQUE_BAIXO": return "Produtos com Estoque Baixo";
      case "EM_FALTA": return "Produtos em Falta";
      default: return "Lista de Produtos";
    }
  };

  // ATUALIZAÇÃO 2: Helper para renderizar Validade ou Garantia na tabela de forma inteligente
  const renderValidadeOuGarantia = (produto: Produto) => {
    if (produto.validade) {
      // Ajuste para fuso horário se necessário, ou uso simples da string se vier YYYY-MM-DD
      return new Date(produto.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }
    if (produto.garantiaMeses !== null && produto.garantiaMeses !== undefined) {
      return `${produto.garantiaMeses} meses (Garantia)`;
    }
    return "-";
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>{getTituloPagina()}</h2>
        
        <button
          onClick={handleAbrirModalAdicao}
          className={styles.addButtonStyle}
          disabled={isSubmitting || deletingProductId !== null}
        >
          <PlusCircle size={18} />
          {isSubmitting ? 'Aguarde...' : 'Adicionar Produto'}
        </button>
      </div>

      {!filtroUrl && (
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
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thStyle}>Nome</th>
            <th className={styles.thStyle}>Marca</th>
            <th className={styles.thStyle}>Categoria</th>
            <th className={styles.thStyle}>Preço</th>
            <th className={styles.thStyle}>Qtd.</th>
            {/* ATUALIZAÇÃO 3: Título da coluna ajustado */}
            <th className={styles.thStyle}>Validade / Garantia</th>
            <th className={styles.thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
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
                {/* ATUALIZAÇÃO 4: Renderização condicional da célula */}
                <td className={styles.tdStyle}>{renderValidadeOuGarantia(produto)}</td>
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
      
      {produtosFiltrados.length === 0 && filtroUrl && (
         <p className={styles.emptySearch}>Nenhum produto encontrado para o filtro: {getTituloPagina()}.</p>
      )}

      {produtosFiltrados.length === 0 && !filtroUrl && termoBusca.length > 0 && (
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