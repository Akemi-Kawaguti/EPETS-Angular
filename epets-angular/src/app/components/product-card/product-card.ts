import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { ProductImg } from '../product-img';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, ProductImg],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
  private readonly cart = inject(CartService);

  protected readonly label = computed(() => {
    const p = this.product();
    return `${p.pet} · ${p.category === 'Rações' ? p.fase : p.category}`;
  });
  protected readonly soldOut = computed(() => this.product().stock === 0);
  protected readonly low = computed(() => this.product().stock > 0 && this.product().stock <= this.product().minStock);
  protected readonly inCart = computed(() => this.cart.qtyOf(this.product().id));

  protected add(): void {
    this.cart.add(this.product());
  }
}
