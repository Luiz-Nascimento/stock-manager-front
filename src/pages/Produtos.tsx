// src/pages/Produtos.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal'; 
import api from '../lib/api';
import styles from './Produtos.module.css'; // 1. Importar o CSS Module

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

  const handleCreateProduct = async (data: NewProductData) => {
    try {
      const response = await api.post('/produtos', data);
      setProdutos([...produtos, response.data]);
      setIsAddModalOpen(false); 
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleUpdateProduct = async (id: number, data: UpdateProductData) => {
    try {
      const response = await api.put(`/produtos/${id}`, data);
      setProdutos(produtos.map(p => 
        p.id === id ? response.data : p
      ));
      setIsEditModalOpen(false);
      setProdutoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao ATUALIZAR produto:", error);
    }
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(produtos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };
  
  const handleAbrirModalEdicao = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    setIsEditModalOpen(true);
  };

  const handleFecharModalEdicao = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setProdutoEmEdicao(null);
    }
  };

  const handleAbrirModalAdicao = () => {
    setIsAddModalOpen(true);
  };
  const handleFecharModalAdicao = (open: boolean) => {
    setIsAddModalOpen(open);
  };

  return (
    // 2. Usar classes CSS
    <div className={styles.pageContainer}> 
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <button 
          onClick={handleAbrirModalAdicao}
          className={styles.addButtonStyle}
        >
          <PlusCircle size={18} />
          Adicionar Produto
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
                >
                  <Edit size={16} color="#3b82f6" />
                </button>
                <button 
                  className={styles.iconButtonStyle}
                  onClick={() => handleDeletar(produto.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddProductModal 
        open={isAddModalOpen}
        onOpenChange={handleFecharModalAdicao}
        onSave={handleCreateProduct}
      />

      <EditProductModal 
        open={isEditModalOpen}
        onOpenChange={handleFecharModalEdicao}
        onSave={handleUpdateProduct}
        produtoToEdit={produtoEmEdicao} 
      />
    </div>
  );
};

// 3. Todos os objetos de estilo foram REMOVIDOS daqui

export default Produtos;