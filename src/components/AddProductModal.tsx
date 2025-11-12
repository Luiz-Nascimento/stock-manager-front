// src/components/AddProductModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { NewProductData } from '../pages/Produtos';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: NewProductData) => Promise<void>;
  isSubmitting: boolean;
}

// NOVO: Mapeamento das categorias (Chave: ENUM, Valor: Label)
const categorias = {
  'ALIMENTICIO': 'Alimentício',
  'BEBIDAS': 'Bebidas',
  'ELETRONICO': 'Eletrônico',
  'DECORACAO': 'Decoração',
  'HIGIENE_PESSOAL': 'Higiene Pessoal',
  'LIMPEZA': 'Limpeza',
  'ESCRITORIO': 'Escritório',
  'FERRAMENTAS': 'Ferramentas',
  'OUTROS': 'Outros'
};


const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  isSubmitting
}) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState('');
  const [categoria, setCategoria] = useState('ALIMENTICIO'); // <-- ADICIONADO (default 'ALIMENTICIO')

  // Pega a data de hoje formatada para o input date (VALIDAÇÃO)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Reseta o form quando o modal fecha
    if (!open) {
      setNome('');
      setMarca('');
      setPreco('');
      setQuantidade('');
      setValidade('');
      setCategoria('ALIMENTICIO'); // <-- ADICIONADO
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      marca,
      categoria, // <-- ADICIONADO
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
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="nome">Nome</label>
              <input className="Input" id="nome" value={nome} onChange={e => setNome(e.target.value)} required disabled={isSubmitting} />
            </fieldset>
            
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="marca">Marca</label>
              <input 
                className="Input" 
                id="marca" 
                value={marca} 
                onChange={e => setMarca(e.target.value)} 
                required 
                disabled={isSubmitting} 
                pattern=".*[a-zA-Z].*" // VALIDAÇÃO: Impede apenas números
                title="A marca deve conter pelo menos uma letra."
              />
            </fieldset>

            {/* NOVO CAMPO DE CATEGORIA */}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="categoria">Categoria</label>
              <select 
                className="Input" // Reutiliza a classe .Input do CSS
                id="categoria" 
                value={categoria} 
                onChange={e => setCategoria(e.target.value)} 
                required 
                disabled={isSubmitting}
              >
                {/* Mapeia o objeto de categorias para as opções */}
                {Object.entries(categorias).map(([valorEnum, label]) => (
                  <option key={valorEnum} value={valorEnum}>
                    {label}
                  </option>
                ))}
              </select>
            </fieldset>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="preco">Preço (R$)</label>
                <input 
                  className="Input" 
                  id="preco" 
                  type="number" 
                  step="0.01" 
                  value={preco} 
                  onChange={e => setPreco(e.target.value)} 
                  required 
                  disabled={isSubmitting} 
                  min="0" // VALIDAÇÃO: Impede negativos
                />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="quantidade">Quantidade</label>
                <input 
                  className="Input" 
                  id="quantidade" 
                  type="number" 
                  step="1" // VALIDAÇÃO: Garante inteiros
                  value={quantidade} 
                  onChange={e => setQuantidade(e.target.value)} 
                  required 
                  disabled={isSubmitting} 
                  min="0" // VALIDAÇÃO: Impede negativos
                />
              </fieldset>
            </div>
            
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="validade">Validade</label>
              <input 
                className="Input" 
                id="validade" 
                type="date" 
                value={validade} 
                onChange={e => setValidade(e.target.value)} 
                required 
                disabled={isSubmitting} 
                min={today} // VALIDAÇÃO: Impede data passada
              />
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