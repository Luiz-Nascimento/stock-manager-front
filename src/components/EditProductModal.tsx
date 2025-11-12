// src/components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { UpdateProductData, Produto } from '../pages/Produtos';

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, data: UpdateProductData) => Promise<void>;
  produtoToEdit: Produto | null;
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

// NOVO: Helper para encontrar a chave (ALIMENTICIO) a partir da descrição (Alimentício)
const getChaveDaDescricao = (descricao: string) => {
  // Object.entries(categorias) === [['ALIMENTICIO', 'Alimentício'], ...]
  const entry = Object.entries(categorias).find(
    ([label]) => label.toLowerCase() === descricao.toLowerCase()
  );
  return entry ? entry[0] : 'OUTROS'; // Retorna a chave (ex: 'ALIMENTICIO') ou 'OUTROS'
};


const EditProductModal: React.FC<EditProductModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  produtoToEdit,
  isSubmitting
}) => {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [categoria, setCategoria] = useState('ALIMENTICIO'); // <-- ADICIONADO

  useEffect(() => {
    if (produtoToEdit) {
      setNome(produtoToEdit.nome);
      setMarca(produtoToEdit.marca);
      setPreco(produtoToEdit.preco);
      setQuantidade(produtoToEdit.quantidade);
      // NOVO: Define o <select> usando a descrição para achar a chave
      setCategoria(getChaveDaDescricao(produtoToEdit.categoria));
    }
  }, [produtoToEdit]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!produtoToEdit) return;

    const data: UpdateProductData = {
      nome,
      marca,
      categoria, // <-- ADICIONADO
      preco: Number(preco),
      quantidade: Number(quantidade)
    };

    onSave(produtoToEdit.id, data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                pattern=".*[a-zA-Z].*" // VALIDAÇÃO: Impede apenas números
                title="A marca deve conter pelo menos uma letra."
              />
            </fieldset>

            {/* NOVO CAMPO DE CATEGORIA */}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="edit-categoria">Categoria</label>
              <select 
                className="Input" 
                id="edit-categoria" 
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
                <label className="Label" htmlFor="edit-preco">Preço</label>
                <input 
                  id="edit-preco" 
                  type="number" 
                  step="0.01" 
                  min="0" // VALIDAÇÃO: Impede negativos
                  value={preco}
                  onChange={(e) => setPreco(Number(e.target.value))}
                  className="Input" 
                  required 
                  disabled={isSubmitting}
                />
              </fieldset>
              <fieldset className="Fieldset" style={{ flex: 1 }}>
                <label className="Label" htmlFor="edit-quantidade">Quantidade</label>
                <input 
                  id="edit-quantidade" 
                  type="number" 
                  min="0" // VALIDAÇÃO: Impede negativos
                  step="1" // VALIDAÇÃO: Garante inteiros
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="Input" 
                  required 
                  disabled={isSubmitting}
                />
              </fieldset>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 25, gap: '1rem' }}>
              <Dialog.Close asChild>
                <button type="button" className="Button secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
              </Dialog.Close>
              <button type="submit" className="Button primary" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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

export default EditProductModal;