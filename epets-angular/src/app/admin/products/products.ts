import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImg } from '../../components/product-img';
import { Fase, Pet, Product } from '../../models/product';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';

type Status = 'todos' | 'ok' | 'baixo' | 'esgotado';

@Component({
  selector: 'app-admin-products',
  imports: [ReactiveFormsModule, CurrencyPipe, ProductImg],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class AdminProducts {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly stock = inject(StockService);
  protected readonly products = inject(ProductService);

  protected readonly pets: Pet[] = ['Cães', 'Gatos', 'Roedores', 'Aves silvestres'];
  protected readonly fases: Fase[] = ['Filhotes', 'Adultos', 'Castrados', 'Todas as fases'];
  protected readonly categorias = computed(() => [...new Set(this.products.items().map((p) => p.category))].sort());

  // ---- filtros da tabela
  protected readonly busca = signal('');
  protected readonly filtroCat = signal('');
  protected readonly filtroStatus = signal<Status>('todos');

  protected readonly lista = computed(() => {
    const q = norm(this.busca());
    return this.products.items().filter((p) => {
      if (this.filtroCat() && p.category !== this.filtroCat()) return false;
      const st = this.status(p);
      if (this.filtroStatus() !== 'todos' && st !== this.filtroStatus()) return false;
      return !q || norm(`${p.name} ${p.brand} ${p.id}`).includes(q);
    });
  });

  // ---- formulário (novo / editar)
  protected readonly aberto = signal(false);
  protected readonly editando = signal<Product | null>(null);
  protected readonly tentou = signal(false);
  protected readonly confirmarExclusao = signal<Product | null>(null);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', Validators.required],
    pet: ['Cães' as Pet, Validators.required],
    category: ['', Validators.required],
    fase: ['Adultos' as Fase, Validators.required],
    detail: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    cost: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    minStock: [6, [Validators.required, Validators.min(0)]],
    image: [''],
    featured: [false],
  });

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  constructor() {
    // /admin/produtos?novo=1 (vem do botão "Novo produto" do painel)
    effect(() => {
      if (this.params().get('novo') && !this.aberto()) {
        this.novo();
        this.router.navigate([], { relativeTo: this.route, queryParams: { novo: null }, queryParamsHandling: 'merge', replaceUrl: true });
      }
    });
  }

  protected status(p: Product): Exclude<Status, 'todos'> {
    return p.stock === 0 ? 'esgotado' : p.stock <= p.minStock ? 'baixo' : 'ok';
  }

  protected novo(): void {
    this.editando.set(null);
    this.tentou.set(false);
    this.form.reset({ pet: 'Cães', fase: 'Adultos', price: 0, cost: 0, stock: 0, minStock: 6, featured: false });
    this.aberto.set(true);
  }

  protected editar(p: Product): void {
    this.editando.set(p);
    this.tentou.set(false);
    this.form.reset({ ...p });
    this.aberto.set(true);
  }

  protected fechar(): void {
    this.aberto.set(false);
  }

  protected invalido(name: string): boolean {
    const c = this.form.get(name)!;
    return c.invalid && (c.touched || this.tentou());
  }

  protected salvar(): void {
    this.tentou.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const base = {
      name: v.name.trim(), brand: v.brand.trim(), pet: v.pet, category: v.category.trim(), fase: v.fase,
      detail: v.detail.trim(), description: v.description.trim(), price: +v.price, cost: +v.cost,
      minStock: +v.minStock, image: v.image.trim() || 'img/sem-foto.jpg', featured: v.featured,
    };
    const atual = this.editando();
    if (atual) {
      this.products.update(atual.id, base);
      if (+v.stock !== atual.stock) this.stock.register(atual.id, 'Ajuste', +v.stock, 'Ajuste pelo cadastro do produto');
    } else {
      const criado = this.products.add({ ...base, stock: 0 });
      if (+v.stock > 0) this.stock.register(criado.id, 'Entrada', +v.stock, 'Estoque inicial');
    }
    this.aberto.set(false);
  }

  protected excluir(): void {
    const p = this.confirmarExclusao();
    if (p) this.products.remove(p.id);
    this.confirmarExclusao.set(null);
  }
}

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
