// src/components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { UpdateProductData, Produto } from '../pages/Produtos';

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, data: UpdateProductData) => void;
  produtoToEdit: Produto | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  produtoToEdit 
}) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    if (produtoToEdit) {
      setNome(produtoToEdit.nome);
      setMarca(produtoToEdit.marca);
      setPreco(produtoToEdit.preco);
      setQuantidade(produtoToEdit.quantidade);
    }
  }, [produtoToEdit]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!produtoToEdit) return;

    const data: UpdateProductData = {
      nome,
      marca,
      preco: Number(preco),
      quantidade: Number(quantidade)
    };

    onSave(produtoToEdit.id, data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* 1. Usando classes CSS do index.css */}
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          
          <Dialog.Title className="DialogTitle">Editar Produto</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Atualize as informações do produto.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="ModalForm">
            
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="edit-nome">Nome</label>
              <input 
                id="edit-nome" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="Input" 
                required 
              />
            </fieldset>

            <fieldset className="Fieldset">
              <label className="Label" htmlFor="edit-marca">Marca</label>
              <input 
                id="edit-marca" 
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="Input" 
                required 
              />
            </fieldset>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="edit-preco">Preço</label>
                <input 
                  id="edit-preco" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={preco}
                  onChange={(e) => setPreco(Number(e.target.value))}
                  className="Input" 
                  required 
                />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="edit-quantidade">Quantidade</label>
                <input 
                  id="edit-quantidade" 
                  type="number" 
                  min="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="Input" 
                  required 
                />
              </fieldset>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 25, gap: '1rem' }}>
              <Dialog.Close asChild>
                <button type="button" className="Button secondary">Cancelar</button>
              </Dialog.Close>
              <button type="submit" className="Button primary">
                Salvar Alterações
              </button>
            </div>
          </form>

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

// 2. Todos os objetos de estilo foram REMOVIDOS daqui

export default EditProductModal;