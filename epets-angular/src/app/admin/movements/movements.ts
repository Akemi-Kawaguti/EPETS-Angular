import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs';
import { MovementType } from '../../models/product';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';

@Component({
  selector: 'app-admin-movements',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class AdminMovements {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly stock = inject(StockService);
  protected readonly products = inject(ProductService);

  protected readonly tipos: MovementType[] = ['Entrada', 'Saída', 'Ajuste'];
  protected readonly sorted = computed(() => [...this.products.items()].sort((a, b) => a.name.localeCompare(b.name)));

  protected readonly form = this.fb.group({
    productId: ['', Validators.required],
    type: ['Entrada' as MovementType],
    quantity: [1, [Validators.required, Validators.min(0)]],
    reason: [''],
  });

  protected readonly msg = signal<{ ok: boolean; text: string } | null>(null);
  protected readonly tentou = signal(false);

  private readonly sel = toSignal(this.form.controls.productId.valueChanges.pipe(startWith('')), { initialValue: '' });
  private readonly tipo = toSignal(this.form.controls.type.valueChanges.pipe(startWith('Entrada' as MovementType)), { initialValue: 'Entrada' as MovementType });
  private readonly qtd = toSignal(this.form.controls.quantity.valueChanges.pipe(startWith(1)), { initialValue: 1 });

  protected readonly produto = computed(() => this.products.byId(this.sel()));
  /** pré-visualização do estoque depois da movimentação */
  protected readonly depois = computed(() => {
    const p = this.produto();
    if (!p) return null;
    const q = Number(this.qtd()) || 0;
    return this.tipo() === 'Entrada' ? p.stock + q : this.tipo() === 'Saída' ? p.stock - q : q;
  });

  // ---- histórico + filtros
  protected readonly filtroTipo = signal<'' | MovementType>('');
  protected readonly busca = signal('');
  protected readonly historico = computed(() => {
    const q = this.busca().toLowerCase();
    return this.stock.list().filter((m) => (!this.filtroTipo() || m.type === this.filtroTipo()) && (!q || m.productName.toLowerCase().includes(q) || m.reason.toLowerCase().includes(q)));
  });

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  constructor() {
    // /admin/movimentacoes?produto=<id> (vem da lista "Precisam de atenção")
    effect(() => {
      const id = this.params().get('produto');
      if (id && this.products.byId(id)) this.form.patchValue({ productId: id, type: 'Entrada', quantity: 10 });
    });
  }

  protected registrar(): void {
    this.tentou.set(true);
    this.msg.set(null);
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const erro = this.stock.register(v.productId, v.type, Number(v.quantity), v.reason);
    if (erro) {
      this.msg.set({ ok: false, text: erro });
      return;
    }
    this.msg.set({ ok: true, text: `${v.type} registrada com sucesso.` });
    this.tentou.set(false);
    this.form.patchValue({ quantity: 1, reason: '' });
  }
}
