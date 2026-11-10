export type Pet = 'Cães' | 'Gatos' | 'Roedores' | 'Aves silvestres';
export type Fase = 'Filhotes' | 'Adultos' | 'Castrados' | 'Todas as fases';

export interface Product {
  id: string;
  name: string;
  brand: string;
  pet: Pet;
  category: string;
  fase: Fase;
  detail: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  image: string;
  featured?: boolean;
}

export type MovementType = 'Entrada' | 'Saída' | 'Ajuste';

export interface Movement {
  id: string;
  date: string; // ISO
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  customer: { nome: string; email: string; telefone: string };
  entrega: 'entrega' | 'retirada';
  endereco?: { cep: string; rua: string; numero: string; bairro: string; cidade: string };
  pagamento: 'pix' | 'cartao' | 'dinheiro';
  items: OrderItem[];
  subtotal: number;
  frete: number;
  total: number;
}
