import { Injectable, effect, inject, signal } from '@angular/core';
import { Order } from '../models/product';
import { ProductService } from './products';
import { StockService } from './stock';
import { Storage } from './storage';

const KEY = 'epets.orders.v1';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storage = inject(Storage);
  private readonly products = inject(ProductService);
  private readonly stock = inject(StockService);
  private readonly _orders = signal<Order[]>(this.storage.read<Order[]>(KEY, []));

  readonly orders = this._orders.asReadonly();

  constructor() {
    effect(() => this.storage.write(KEY, this._orders()));
  }

  byId(id: string): Order | undefined {
    return this._orders().find((o) => o.id === id);
  }

  /** Cria o pedido e dá baixa no estoque (aparece como "Saída" em Movimentações). */
  create(data: Omit<Order, 'id' | 'date'>): Order {
    const order: Order = {
      ...data,
      id: String(Math.floor(100000 + Math.random() * 900000)),
      date: new Date().toISOString(),
    };
    for (const item of order.items) {
      if (this.products.byId(item.productId)) {
        this.stock.register(item.productId, 'Saída', item.qty, `Pedido #${order.id} (loja online)`);
      }
    }
    this._orders.update((l) => [order, ...l]);
    return order;
  }
}
