// src/components/AddProductModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { NewProductData } from '../pages/Produtos'; // Importar o tipo

// 1. ATUALIZAR AS PROPS AQUI
interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: NewProductData) => Promise<void>; // Corrigido para Promise<void>
  isSubmitting: boolean; // <--- ESTA LINHA FOI ADICIONADA
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  isSubmitting // 2. Receber a prop
}) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState('');

  useEffect(() => {
    if (!open) {
      setNome('');
      setMarca('');
      setPreco('');
      setQuantidade('');
      setValidade('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      marca,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      validade,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Adicionar Novo Produto</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Preencha as informações do novo item para o estoque.
          </Dialog.Description>
          
          <form onSubmit={handleSubmit} className="ModalForm">
            {/* ... (Fieldsets não mudam) ... */}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="nome">Nome</label>
              <input className="Input" id="nome" value={nome} onChange={e => setNome(e.target.value)} required disabled={isSubmitting} />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="marca">Marca</label>
              <input className="Input" id="marca" value={marca} onChange={e => setMarca(e.target.value)} required disabled={isSubmitting} />
            </fieldset>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="preco">Preço (R$)</label>
                <input className="Input" id="preco" type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required disabled={isSubmitting} />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="quantidade">Quantidade</label>
                <input className="Input" id="quantidade" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required disabled={isSubmitting} />
              </fieldset>
            </div>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="validade">Validade</label>
              <input className="Input" id="validade" type="date" value={validade} onChange={e => setValidade(e.target.value)} required disabled={isSubmitting} />
            </fieldset>
            
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end', gap: '1rem' }}>
              <Dialog.Close asChild>
                <button type="button" className="Button secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
              </Dialog.Close>
              <button type="submit" className="Button primary" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Fechar" disabled={isSubmitting}>
              <X size={16} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddProductModal;