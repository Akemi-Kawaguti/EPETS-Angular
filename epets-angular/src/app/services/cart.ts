import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartLine, Product } from '../models/product';
import { ProductService } from './products';
import { Storage } from './storage';

const KEY = 'epets.cart.v1';
export const FRETE_FIXO = 12.9;
export const FRETE_GRATIS_ACIMA = 149;

export interface CartItem {
  product: Product;
  qty: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(Storage);
  private readonly products = inject(ProductService);
  private readonly lines = signal<CartLine[]>(this.storage.read<CartLine[]>(KEY, []));

  /** linhas já com os dados do produto (descarta produtos que foram removidos do catálogo) */
  readonly items = computed<CartItem[]>(() =>
    this.lines().flatMap((l) => {
      const product = this.products.byId(l.productId);
      return product ? [{ product, qty: l.qty, total: product.price * l.qty }] : [];
    }),
  );
  readonly count = computed(() => this.items().reduce((s, i) => s + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((s, i) => s + i.total, 0));
  readonly freteEntrega = computed(() => (this.subtotal() >= FRETE_GRATIS_ACIMA || this.subtotal() === 0 ? 0 : FRETE_FIXO));
  readonly faltaFreteGratis = computed(() => Math.max(0, FRETE_GRATIS_ACIMA - this.subtotal()));

  constructor() {
    effect(() => this.storage.write(KEY, this.lines()));
  }

  qtyOf(productId: string): number {
    return this.lines().find((l) => l.productId === productId)?.qty ?? 0;
  }

  add(product: Product, qty = 1): void {
    const max = product.stock;
    this.lines.update((ls) => {
      const found = ls.find((l) => l.productId === product.id);
      if (!found) return max > 0 ? [...ls, { productId: product.id, qty: Math.min(qty, max) }] : ls;
      return ls.map((l) => (l.productId === product.id ? { ...l, qty: Math.min(l.qty + qty, max) } : l));
    });
  }

  setQty(productId: string, qty: number): void {
    const max = this.products.byId(productId)?.stock ?? 0;
    if (qty <= 0) return this.remove(productId);
    this.lines.update((ls) => ls.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, max) } : l)));
  }

  remove(productId: string): void {
    this.lines.update((ls) => ls.filter((l) => l.productId !== productId));
  }

  clear(): void {
    this.lines.set([]);
  }
}
