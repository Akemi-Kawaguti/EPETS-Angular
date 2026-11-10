import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImg } from '../../components/product-img';
import { CartService, FRETE_FIXO, FRETE_GRATIS_ACIMA } from '../../services/cart';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe, ProductImg],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartPage {
  protected readonly cart = inject(CartService);
  protected readonly freteFixo = FRETE_FIXO;
  protected readonly freteGratis = FRETE_GRATIS_ACIMA;
}
