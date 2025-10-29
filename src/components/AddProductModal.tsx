// src/components/AddProductModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

// Dados que o formulário envia
type NewProductData = {
  nome: string;
  marca: string;
  preco: number;
  quantidade: number;
  validade: string;
};

// Props que o componente recebe (simplificado)
interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: NewProductData) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onOpenChange, onSave }) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState('');

  // Efeito para limpar o formulário quando o modal for fechado
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
    // A página 'Produtos' agora é responsável por fechar o modal
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
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="nome">Nome</label>
              <input className="Input" id="nome" value={nome} onChange={e => setNome(e.target.value)} required />
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="marca">Marca</label>
              <input className="Input" id="marca" value={marca} onChange={e => setMarca(e.target.value)} required />
            </fieldset>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="preco">Preço (R$)</label>
                <input className="Input" id="preco" type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="quantidade">Quantidade</label>
                <input className="Input" id="quantidade" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
              </fieldset>
            </div>

            <fieldset className="Fieldset">
              <label className="Label" htmlFor="validade">Validade</label>
              <input className="Input" id="validade" type="date" value={validade} onChange={e => setValidade(e.target.value)} required />
            </fieldset>
            
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end', gap: '1rem' }}>
              <Dialog.Close asChild>
                <button type="button" className="Button secondary">Cancelar</button>
              </Dialog.Close>
              <button type="submit" className="Button primary">Salvar Produto</button>
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

export default AddProductModal;