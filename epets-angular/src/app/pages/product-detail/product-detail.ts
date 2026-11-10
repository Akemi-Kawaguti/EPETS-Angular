import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductImg } from '../../components/product-img';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/products';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, ProductCard, ProductImg],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly products = inject(ProductService);
  protected readonly cart = inject(CartService);

  private readonly id = toSignal(this.route.paramMap.pipe(map((m) => m.get('id') ?? '')), { requireSync: true });

  protected readonly product = computed(() => this.products.byId(this.id()));
  protected readonly related = computed(() => {
    const p = this.product();
    return p ? this.products.related(p) : [];
  });

  protected readonly qty = signal(1);
  protected readonly added = signal(false);

  protected readonly soldOut = computed(() => (this.product()?.stock ?? 0) === 0);
  protected readonly available = computed(() => Math.max(0, (this.product()?.stock ?? 0) - this.cart.qtyOf(this.id())));
  protected readonly low = computed(() => {
    const p = this.product();
    return !!p && p.stock > 0 && p.stock <= p.minStock;
  });

  protected changeQty(delta: number): void {
    this.qty.update((q) => Math.min(Math.max(1, q + delta), Math.max(1, this.available())));
  }

  protected add(): void {
    const p = this.product();
    if (!p || this.available() === 0) return;
    this.cart.add(p, this.qty());
    this.qty.set(1);
    this.added.set(true);
  }

  protected buyNow(): void {
    this.add();
    this.router.navigate(['/sacola']);
  }
}
