
export type ItemVenda = {
  id: number;
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
};

export type Pedido = {
  id: number;
  dataPedido: string;
  valorTotal: number;
  quantidadeTotalItens: number;
  vendas: ItemVenda[];
};