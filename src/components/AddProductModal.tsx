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
  const [categoria, setCategoria] = useState('ALIMENTICIO');
  
  // NOVOS ESTADOS para controlar o tipo de validade
  const [tipoValidade, setTipoValidade] = useState<'validade' | 'garantia'>('validade');
  const [validade, setValidade] = useState('');
  const [garantiaMeses, setGarantiaMeses] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!open) {
      setNome('');
      setMarca('');
      setPreco('');
      setQuantidade('');
      setCategoria('ALIMENTICIO');
      // Reseta os campos novos
      setTipoValidade('validade');
      setValidade('');
      setGarantiaMeses('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara o objeto enviando null para o campo que não foi escolhido
    const data: NewProductData = {
      nome,
      marca,
      categoria,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      // Se escolheu validade, envia a data, senão null
      validade: tipoValidade === 'validade' ? validade : null,
      // Se escolheu garantia, envia o número, senão null
      garantiaMeses: tipoValidade === 'garantia' && garantiaMeses ? parseInt(garantiaMeses) : null
    };

    onSave(data);
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
                pattern=".*[a-zA-Z].*"
                title="A marca deve conter pelo menos uma letra."
              />
            </fieldset>

            <fieldset className="Fieldset">
              <label className="Label" htmlFor="categoria">Categoria</label>
              <select 
                className="Input" 
                id="categoria" 
                value={categoria} 
                onChange={e => setCategoria(e.target.value)} 
                required 
                disabled={isSubmitting}
              >
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
                  min="0" 
                />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="quantidade">Quantidade</label>
                <input 
                  className="Input" 
                  id="quantidade" 
                  type="number" 
                  step="1" 
                  value={quantidade} 
                  onChange={e => setQuantidade(e.target.value)} 
                  required 
                  disabled={isSubmitting} 
                  min="0" 
                />
              </fieldset>
            </div>
            
            {/* SEÇÃO NOVA: Tipo de Validade */}
            <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
              <label className="Label" style={{ marginBottom: '0.5rem', display: 'block' }}>Tipo de Vencimento</label>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="tipoValidade" 
                    value="validade"
                    checked={tipoValidade === 'validade'}
                    onChange={() => setTipoValidade('validade')}
                    disabled={isSubmitting}
                  />
                  Data de Validade
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="tipoValidade" 
                    value="garantia"
                    checked={tipoValidade === 'garantia'}
                    onChange={() => setTipoValidade('garantia')}
                    disabled={isSubmitting}
                  />
                  Garantia
                </label>
              </div>

              {tipoValidade === 'validade' ? (
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="validade">Data de Validade</label>
                  <input 
                    className="Input" 
                    id="validade" 
                    type="date" 
                    value={validade} 
                    onChange={e => setValidade(e.target.value)} 
                    required 
                    disabled={isSubmitting} 
                    min={today} 
                  />
                </fieldset>
              ) : (
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="garantia">Garantia (Meses)</label>
                  <input 
                    className="Input" 
                    id="garantia" 
                    type="number" 
                    placeholder="Ex: 12"
                    value={garantiaMeses} 
                    onChange={e => setGarantiaMeses(e.target.value)} 
                    required 
                    disabled={isSubmitting} 
                    min="0" 
                  />
                </fieldset>
              )}
            </div>
            
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