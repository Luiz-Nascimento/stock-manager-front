// src/pages/Produtos.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal'; // <--- 1. NOVO: Importar o modal de edição
import api from '../lib/api';

// (O tipo Produto continua o mesmo)
export type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  validade: string; // A API vai retornar, mas não vamos editar
};

// (O tipo NewProductData continua o mesmo)
type NewProductData = Omit<Produto, 'id'>;

// 2. NOVO: Tipo para os dados de ATUALIZAÇÃO
// (Baseado no seu DTO 'ProdutoUpdate', sem a validade)
export type UpdateProductData = Omit<Produto, 'id' | 'validade'>;

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // MUDANÇA: Renomeado para clareza

  // 3. NOVO: Estados para o modal de EDIÇÃO
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  // (O useEffect para buscar produtos continua o mesmo)
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

  // (handleSaveProduct renomeado para handleCreateProduct para clareza)
  const handleCreateProduct = async (data: NewProductData) => {
    try {
      const response = await api.post('/produtos', data);
      setProdutos([...produtos, response.data]);
      setIsAddModalOpen(false); 
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // 4. NOVO: Função para salvar a ATUALIZAÇÃO (chama o PUT)
  const handleUpdateProduct = async (id: number, data: UpdateProductData) => {
    try {
      // Usa o 'api' para fazer a chamada PUT
      const response = await api.put(`/produtos/${id}`, data);
      
      // Atualiza a lista de produtos no front-end
      setProdutos(produtos.map(p => 
        p.id === id ? response.data : p // Substitui o produto antigo pelo novo
      ));
      
      setIsEditModalOpen(false); // Fecha o modal de edição
      setProdutoEmEdicao(null); // Limpa o estado
    } catch (error) {
      console.error("Erro ao ATUALIZAR produto:", error);
    }
  };

  // (handleDeletar continua o mesmo)
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
  
  // 5. NOVO: Funções para controlar o modal de EDIÇÃO
  const handleAbrirModalEdicao = (produto: Produto) => {
    setProdutoEmEdicao(produto); // Define qual produto estamos editando
    setIsEditModalOpen(true); // Abre o modal
  };

  const handleFecharModalEdicao = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setProdutoEmEdicao(null); // Limpa o estado ao fechar
    }
  };

  // Funções para o modal de ADIÇÃO (renomeadas)
  const handleAbrirModalAdicao = () => {
    setIsAddModalOpen(true);
  };
  const handleFecharModalAdicao = (open: boolean) => {
    setIsAddModalOpen(open);
  };


  return (
    <div style={{ color: '#e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem' }}>Lista de Produtos</h2>
        <button 
          onClick={handleAbrirModalAdicao} // MUDANÇA: onClick
          style={addButtonStyle}
        >
          <PlusCircle size={18} />
          Adicionar Produto
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #4a4a4a' }}>
            {/* ... (seus <th> continuam os mesmos) ... */}
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Marca</th>
            <th style={thStyle}>Preço</th>
            <th style={thStyle}>Qtd.</th>
            <th style={thStyle}>Validade</th>
            <th style={thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id} style={{ borderBottom: '1px solid #3a3a3a' }}>
              {/* ... (seus <td> de dados continuam os mesmos) ... */}
              <td style={tdStyle}>{produto.nome}</td>
              <td style={tdStyle}>{produto.marca}</td>
              <td style={tdStyle}>R$ {produto.preco.toFixed(2)}</td>
              <td style={tdStyle}>{produto.quantidade}</td>
              <td style={tdStyle}>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
              <td style={tdStyle}>
                <button 
                  style={iconButtonStyle}
                  // 6. MUDANÇA: Chama a função para abrir o modal de edição
                  onClick={() => handleAbrirModalEdicao(produto)}
                >
                  <Edit size={16} color="#3b82f6" />
                </button>
                <button 
                  style={iconButtonStyle}
                  onClick={() => handleDeletar(produto.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de ADICIONAR */}
      <AddProductModal 
        open={isAddModalOpen}
        onOpenChange={handleFecharModalAdicao}
        onSave={handleCreateProduct}
      />

      {/* 7. NOVO: Renderiza o modal de EDIÇÃO */}
      <EditProductModal 
        open={isEditModalOpen}
        onOpenChange={handleFecharModalEdicao}
        onSave={handleUpdateProduct}
        // Passamos o produto selecionado para o modal preencher os campos
        produtoToEdit={produtoEmEdicao} 
      />
    </div>
  );
};

// (Estilos - Copie e cole seus estilos aqui)
const addButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
};
const thStyle: React.CSSProperties = { 
  padding: '0.75rem 0.5rem',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  color: '#a0a0a0',
};
const tdStyle: React.CSSProperties = { 
  padding: '1rem 0.5rem',
  color: '#e0e0e0',
};
const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem'
};

export default Produtos;