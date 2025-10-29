import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
// Importamos os tipos que definimos na página de Produtos
import type { UpdateProductData, Produto } from '../pages/Produtos';

// Definindo as props do nosso modal de edição
interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // A função onSave agora espera o ID e os dados de atualização
  onSave: (id: number, data: UpdateProductData) => void;
  // O produto que será editado (pode ser null quando fechado)
  produtoToEdit: Produto | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  produtoToEdit 
}) => {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  // 1. Efeito para preencher o formulário
  // Isso roda toda vez que 'produtoToEdit' mudar
  useEffect(() => {
    if (produtoToEdit) {
      // Se temos um produto, preenchemos os estados do formulário
      setNome(produtoToEdit.nome);
      setMarca(produtoToEdit.marca);
      setPreco(produtoToEdit.preco);
      setQuantidade(produtoToEdit.quantidade);
    }
  }, [produtoToEdit]); // Dependência: só roda se 'produtoToEdit' mudar

  // 2. Função de Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Validação: Se por algum motivo não houver produto, não faz nada
    if (!produtoToEdit) return;

    // Monta o objeto de dados (UpdateProductData)
    const data: UpdateProductData = {
      nome,
      marca,
      preco: Number(preco), // Garante que é número
      quantidade: Number(quantidade) // Garante que é número
    };

    // Chama a função onSave que veio da página 'Produtos'
    onSave(produtoToEdit.id, data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Dialog.Title style={titleTextStyle}>Editar Produto</Dialog.Title>
            <Dialog.Close asChild>
              <button style={closeButtonStyle}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* 3. O formulário chama 'handleSubmit' */}
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
            
            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" style={labelStyle}>Nome</label>
              <input 
                id="nome" 
                value={nome} // Controlado pelo estado
                onChange={(e) => setNome(e.target.value)} // Atualiza o estado
                style={inputStyle} 
                required 
              />
            </div>

            {/* Campo Marca */}
            <div>
              <label htmlFor="marca" style={labelStyle}>Marca</label>
              <input 
                id="marca" 
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                style={inputStyle} 
                required 
              />
            </div>

            {/* Linha para Preço e Quantidade */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="preco" style={labelStyle}>Preço</label>
                <input 
                  id="preco" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={preco}
                  onChange={(e) => setPreco(Number(e.target.value))}
                  style={inputStyle} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="quantidade" style={labelStyle}>Quantidade</label>
                <input 
                  id="quantidade" 
                  type="number" 
                  min="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  style={inputStyle} 
                  required 
                />
              </div>
            </div>

            {/* 4. NÃO HÁ CAMPO DE DATA DE VALIDADE */}

            {/* Botão de Salvar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" style={saveButtonStyle}>
                Salvar Alterações
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// (Estilos - Copie e cole os estilos do seu AddProductModal)
const overlayStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  inset: 0,
  zIndex: 10,
};
const contentStyle: React.CSSProperties = {
  background: '#2a2a2a',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '500px',
  padding: '1.5rem',
  zIndex: 20,
  color: '#e0e0e0',
};
const titleTextStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  margin: 0,
};
const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#a0a0a0',
  cursor: 'pointer',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box', // Garante que o padding não estoure a largura
  padding: '0.75rem',
  background: '#3a3a3a',
  border: '1px solid #5a5a5a',
  borderRadius: '6px',
  color: 'white',
  fontSize: '1rem',
};
const saveButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
};

export default EditProductModal;