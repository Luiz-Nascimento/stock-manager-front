// src/pages/Produtos.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import api from '../lib/api'; // <--- 1. Importe o cliente API

// (O tipo Produto continua o mesmo)
type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  validade: string;
};

// (O tipo NewProductData continua o mesmo)
type NewProductData = Omit<Produto, 'id'>;

const Produtos: React.FC = () => {
  // 2. O estado começa como um array vazio
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // (NÃO PRECISAMOS MAIS DE 'dadosIniciais')

  // 3. useEffect AGORA BUSCA DADOS DA API
  useEffect(() => {
    // Função para buscar os dados
    const fetchProdutos = async () => {
      try {
        // Usa o 'api' para fazer a chamada GET
        const response = await api.get('/produtos');
        setProdutos(response.data); // Coloca os dados do back-end no estado
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        // Em um app real, você mostraria uma mensagem para o usuário
      }
    };

    fetchProdutos(); // Chama a função assim que o componente montar
  }, []); // O array vazio garante que isso rode só uma vez

  // 4. handleSaveProduct AGORA ENVIA DADOS PARA A API
  const handleSaveProduct = async (data: NewProductData) => {
    try {
      // Usa o 'api' para fazer a chamada POST
      const response = await api.post('/produtos', data);
      
      // Adiciona o novo produto (retornado pela API com o ID correto)
      setProdutos([...produtos, response.data]);
      setIsModalOpen(false); // Fecha o modal
      
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // 5. handleDeletar AGORA CHAMA A API
  const handleDeletar = async (id: number) => {
    // Confirmação antes de deletar (opcional, mas recomendado)
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }
    
    try {
      // Usa o 'api' para fazer a chamada DELETE
      await api.delete(`/produtos/${id}`);
      
      // Remove o produto da lista no front-end (só após o sucesso)
      setProdutos(produtos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };
  
  // 6. handleAdicionar (agora simplificado)
  const handleAdicionar = () => {
    setIsModalOpen(true);
  };
  
  // 7. handleCloseModal (agora simplificado)
  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <div style={{ color: '#e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.75rem' }}>Lista de Produtos</h2>
        <button 
          onClick={handleAdicionar}
          style={addButtonStyle}
        >
          <PlusCircle size={18} />
          Adicionar Produto
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #4a4a4a' }}>
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
              <td style={tdStyle}>{produto.nome}</td>
              <td style={tdStyle}>{produto.marca}</td>
              <td style={tdStyle}>R$ {produto.preco.toFixed(2)}</td>
              <td style={tdStyle}>{produto.quantidade}</td>
              <td style={tdStyle}>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
              <td style={tdStyle}>
                <button 
                  style={iconButtonStyle}
                  // 8. Desabilitamos o onClick do 'Editar' por enquanto
                  onClick={() => alert('Função "Editar" será implementada!')}
                >
                  <Edit size={16} color="#3b82f6" />
                </button>
                <button 
                  style={iconButtonStyle}
                  onClick={() => handleDeletar(produto.id)} // <--- Chama o delete da API
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 9. Renderiza o modal (simplificado) */}
      <AddProductModal 
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onSave={handleSaveProduct}
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