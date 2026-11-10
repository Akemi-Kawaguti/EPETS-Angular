import { Component, computed, input, signal } from '@angular/core';
import { Product } from '../models/product';

/**
 * Mostra a foto do produto (public/img/...). Se o arquivo ainda não existir,
 * mostra um placeholder (public/epets.png) para a tela nunca ficar com imagem quebrada.
 */
@Component({
  selector: 'app-product-img',
  template: `<img [src]="src()" [alt]="product().name" [class.fallback]="failed()" (error)="failed.set(true)" />`,
  styles: `
    :host { display: contents; }
    img { max-height: 100%; max-width: 100%; width: 100%; height: 100%; object-fit: contain; }
    /* sem foto cadastrada: mostra a patinha da E’PETS discreta, em vez de uma imagem quebrada */
    img.fallback { width: 42%; height: auto; opacity: .35; }
  `,
})
export class ProductImg {
  readonly product = input.required<Product>();
  protected readonly failed = signal(false);
  protected readonly src = computed(() => (this.failed() ? 'epets.png' : this.product().image));
}
