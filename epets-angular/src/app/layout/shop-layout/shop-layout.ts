import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/** Moldura da loja: header + página + footer. */
@Component({
  selector: 'app-shop-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <main><router-outlet /></main>
    <app-footer />
  `,
})
export class ShopLayout {}
