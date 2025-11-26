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

const getChaveDaDescricao = (descricao: string) => {
  const entry = Object.entries(categorias).find(
    ([label]) => label.toLowerCase() === descricao.toLowerCase()
  );
  return entry ? entry[0] : 'OUTROS';
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
  const [categoria, setCategoria] = useState('ALIMENTICIO');

  // NOVOS ESTADOS
  const [tipoValidade, setTipoValidade] = useState<'validade' | 'garantia'>('validade');
  const [validade, setValidade] = useState('');
  const [garantiaMeses, setGarantiaMeses] = useState('');

  useEffect(() => {
    if (produtoToEdit) {
      setNome(produtoToEdit.nome);
      setMarca(produtoToEdit.marca);
      setPreco(produtoToEdit.preco);
      setQuantidade(produtoToEdit.quantidade);
      setCategoria(getChaveDaDescricao(produtoToEdit.categoria));

      // LÓGICA INTELIGENTE: Detecta o que o produto tem
      if (produtoToEdit.validade) {
        setTipoValidade('validade');
        // Formata data YYYY-MM-DD para o input date
        setValidade(new Date(produtoToEdit.validade).toISOString().split('T')[0]);
        setGarantiaMeses('');
      } else if (produtoToEdit.garantiaMeses !== null && produtoToEdit.garantiaMeses !== undefined) {
        setTipoValidade('garantia');
        setGarantiaMeses(produtoToEdit.garantiaMeses.toString());
        setValidade('');
      } else {
        // Padrão se não tiver nenhum (raro)
        setTipoValidade('validade');
        setValidade('');
        setGarantiaMeses('');
      }
    }
  }, [produtoToEdit]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!produtoToEdit) return;

    // Prepara payload para atualização
    const data: UpdateProductData = {
      nome,
      marca,
      categoria,
      preco: Number(preco),
      quantidade: Number(quantidade),
      // Envia o campo selecionado e anula o outro
      validade: tipoValidade === 'validade' ? validade : null,
      garantiaMeses: tipoValidade === 'garantia' && garantiaMeses ? parseInt(garantiaMeses) : null
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
                pattern=".*[a-zA-Z].*"
                title="A marca deve conter pelo menos uma letra."
              />
            </fieldset>

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
                  min="0"
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
                  min="0"
                  step="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="Input" 
                  required 
                  disabled={isSubmitting}
                />
              </fieldset>
            </div>

            {/* SEÇÃO NOVA: Tipo de Validade na Edição */}
            <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
              <label className="Label" style={{ marginBottom: '0.5rem', display: 'block' }}>Tipo de Vencimento</label>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="edit-tipoValidade" 
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
                    name="edit-tipoValidade" 
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
                  <label className="Label" htmlFor="edit-validade">Data de Validade</label>
                  <input 
                    className="Input" 
                    id="edit-validade" 
                    type="date" 
                    value={validade} 
                    onChange={e => setValidade(e.target.value)} 
                    required 
                    disabled={isSubmitting} 
                  />
                </fieldset>
              ) : (
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="edit-garantia">Garantia (Meses)</label>
                  <input 
                    className="Input" 
                    id="edit-garantia" 
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