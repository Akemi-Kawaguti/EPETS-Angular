import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/orders';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly orders = inject(OrderService);
  protected readonly cart = inject(CartService);

  protected readonly form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
    entrega: ['entrega' as 'entrega' | 'retirada'],
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    cidade: ['São Paulo', Validators.required],
    pagamento: ['pix' as 'pix' | 'cartao' | 'dinheiro'],
  });

  protected readonly submitted = signal(false);
  protected readonly erro = signal('');

  private readonly entrega = toSignal(this.form.controls.entrega.valueChanges.pipe(startWith(this.form.controls.entrega.value)), {
    requireSync: true,
  });
  protected readonly retirada = computed(() => this.entrega() === 'retirada');
  protected readonly frete = computed(() => (this.retirada() ? 0 : this.cart.freteEntrega()));
  protected readonly total = computed(() => this.cart.subtotal() + this.frete());

  constructor() {
    // sem entrega = sem endereço obrigatório
    effect(() => {
      const c = this.form.controls;
      for (const k of [c.cep, c.rua, c.numero, c.bairro, c.cidade]) {
        if (this.retirada()) k.disable({ emitEvent: false });
        else k.enable({ emitEvent: false });
      }
    });
  }

  protected invalid(name: string): boolean {
    const c = this.form.get(name)!;
    return c.invalid && (c.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.erro.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const items = this.cart.items();
    if (!items.length) return;

    const semEstoque = items.find((i) => i.qty > i.product.stock);
    if (semEstoque) {
      this.erro.set(`"${semEstoque.product.name}" não tem mais ${semEstoque.qty} un. em estoque. Ajuste a quantidade na sacola.`);
      return;
    }

    const v = this.form.getRawValue();
    const order = this.orders.create({
      customer: { nome: v.nome.trim(), email: v.email.trim(), telefone: v.telefone },
      entrega: v.entrega,
      endereco: v.entrega === 'entrega' ? { cep: v.cep, rua: v.rua, numero: v.numero, bairro: v.bairro, cidade: v.cidade } : undefined,
      pagamento: v.pagamento,
      items: items.map((i) => ({ productId: i.product.id, name: i.product.name, detail: i.product.detail, price: i.product.price, qty: i.qty })),
      subtotal: this.cart.subtotal(),
      frete: this.frete(),
      total: this.total(),
    });
    this.cart.clear();
    this.router.navigate(['/confirmacao', order.id]);
  }
}
