import { Injectable, effect, inject, signal } from '@angular/core';
import { Movement, MovementType } from '../models/product';
import { ProductService } from './products';
import { Storage } from './storage';

const KEY = 'epets.movements.v1';

function daysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const SEED: Movement[] = [
  { id: 'm1', date: daysAgo(0, 9), productId: 'sache-atum', productName: 'Sachê Whiskas Atum ao molho', type: 'Entrada', quantity: 60, reason: 'Reposição do fornecedor' },
  { id: 'm2', date: daysAgo(1, 15), productId: 'golden-adultos', productName: 'Golden Fórmula Cães Adultos', type: 'Saída', quantity: 2, reason: 'Venda no balcão' },
  { id: 'm3', date: daysAgo(2, 11), productId: 'caminha-europa-gg', productName: 'Caminha Europa GG', type: 'Saída', quantity: 1, reason: 'Venda no balcão' },
  { id: 'm4', date: daysAgo(3, 14), productId: 'bifinho-frango', productName: 'Bifinho de frango', type: 'Entrada', quantity: 30, reason: 'Reposição do fornecedor' },
  { id: 'm5', date: daysAgo(5, 10), productId: 'whiskas-adultos', productName: 'Whiskas Gatos Adultos', type: 'Ajuste', quantity: 1, reason: 'Contagem de inventário' },
];

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly storage = inject(Storage);
  private readonly products = inject(ProductService);
  private readonly _list = signal<Movement[]>(this.storage.read<Movement[]>(KEY, SEED));

  readonly list = this._list.asReadonly();

  constructor() {
    effect(() => this.storage.write(KEY, this._list()));
  }

  /**
   * Registra a movimentação e atualiza o estoque do produto.
   * - Entrada: soma · Saída: subtrai · Ajuste: define o estoque para a quantidade informada.
   * Retorna uma mensagem de erro (ou null se deu certo).
   */
  register(productId: string, type: MovementType, quantity: number, reason: string): string | null {
    const p = this.products.byId(productId);
    if (!p) return 'Produto não encontrado.';
    if (!Number.isFinite(quantity) || quantity < 0 || (type !== 'Ajuste' && quantity === 0)) return 'Informe uma quantidade válida.';
    if (type === 'Saída' && quantity > p.stock) return `Estoque insuficiente: só há ${p.stock} un. de "${p.name}".`;

    if (type === 'Entrada') this.products.changeStock(p.id, quantity);
    else if (type === 'Saída') this.products.changeStock(p.id, -quantity);
    else this.products.setStock(p.id, quantity);

    const mov: Movement = {
      id: `m${Date.now()}${Math.floor(Math.random() * 100)}`,
      date: new Date().toISOString(),
      productId: p.id,
      productName: p.name,
      type,
      quantity,
      reason: reason.trim() || '—',
    };
    this._list.update((l) => [mov, ...l]);
    return null;
  }
}
