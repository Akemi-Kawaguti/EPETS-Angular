import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../models/product';
import { SEED_PRODUCTS } from '../models/seed';
import { Storage } from './storage';

const KEY = 'epets.products.v1';

/**
 * Catálogo + estoque.
 * Hoje usa dados locais (localStorage). Quando o back-end estiver pronto,
 * é só trocar o corpo dos métodos por chamadas HttpClient — o resto do app não muda.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly storage = inject(Storage);
  private readonly _items = signal<Product[]>(this.storage.read<Product[]>(KEY, SEED_PRODUCTS));

  readonly items = this._items.asReadonly();
  readonly featured = computed(() => this._items().filter((p) => p.featured));

  // ---- indicadores do painel admin
  readonly totalUnits = computed(() => this._items().reduce((s, p) => s + p.stock, 0));
  readonly stockValue = computed(() => this._items().reduce((s, p) => s + p.stock * p.cost, 0));
  readonly outOfStock = computed(() => this._items().filter((p) => p.stock === 0));
  readonly lowStock = computed(() => this._items().filter((p) => p.stock > 0 && p.stock <= p.minStock));
  readonly needAttention = computed(() =>
    this._items()
      .filter((p) => p.stock <= p.minStock)
      .sort((a, b) => a.stock - b.stock),
  );
  readonly stockByCategory = computed(() => {
    const map = new Map<string, number>();
    for (const p of this._items()) map.set(p.category, (map.get(p.category) ?? 0) + p.stock);
    return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  });

  constructor() {
    effect(() => this.storage.write(KEY, this._items()));
  }

  byId(id: string): Product | undefined {
    return this._items().find((p) => p.id === id);
  }

  related(p: Product, limit = 4): Product[] {
    return this._items()
      .filter((x) => x.id !== p.id && x.pet === p.pet)
      .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
      .slice(0, limit);
  }

  add(data: Omit<Product, 'id'>): Product {
    const base = slug(data.name) || 'produto';
    let id = base;
    let n = 2;
    while (this.byId(id)) id = `${base}-${n++}`;
    const novo: Product = { ...data, id };
    this._items.update((l) => [novo, ...l]);
    return novo;
  }

  update(id: string, data: Partial<Product>): void {
    this._items.update((l) => l.map((p) => (p.id === id ? { ...p, ...data, id } : p)));
  }

  remove(id: string): void {
    this._items.update((l) => l.filter((p) => p.id !== id));
  }

  /** delta positivo = entrada, negativo = saída. Nunca deixa o estoque negativo. */
  changeStock(id: string, delta: number): void {
    this._items.update((l) => l.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  }

  setStock(id: string, value: number): void {
    this.update(id, { stock: Math.max(0, value) });
  }

  resetDemo(): void {
    this._items.set(SEED_PRODUCTS);
  }
}

export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
