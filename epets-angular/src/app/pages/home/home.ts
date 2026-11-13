import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { Product } from '../../models/product';
import { ProductService } from '../../services/products';
import { WHATSAPP_URL } from '../../config/contato';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  host: { '(document:keydown.escape)': 'fecharHistoria()' },
})
export class Home {
  private readonly products = inject(ProductService);

  protected readonly favoritos = computed(() => this.products.featured().slice(0, 4));
  protected readonly pequenos = computed(() =>
    ['nutropica-hamster', 'alcon-curio', 'bola-borracha', 'comedouro-inox']
      .map((id) => this.products.byId(id))
      .filter((p): p is Product => !!p),
  );

  protected readonly categorias = [
    { pet: 'Cães', img: 'cachorro.jpg', texto: 'Para todas as fases da amizade' },
    { pet: 'Gatos', img: 'gato.jpg', texto: 'Cuidado no ritmo deles' },
    { pet: 'Roedores', img: 'roedor.jpg', texto: 'Pequenos no tamanho, grandes no amor' },
    { pet: 'Aves silvestres', img: 'ave.jpg', texto: 'Nutrição para cada espécie' },
  ];

  protected readonly marcas = [
    { nome: 'Golden', img: 'golden.png' },
    { nome: 'PremieR', img: 'premier.png' },
    { nome: 'Magnus', img: 'magnus.png' },
    { nome: 'Purina', img: 'purina.png' },
    { nome: 'Pedigree', img: 'pedigree.png' },
  ];

  protected readonly whatsapp = WHATSAPP_URL;

  // janela "Nossa história"
  protected readonly historiaAberta = signal(false);

  protected abrirHistoria() {
    this.historiaAberta.set(true);
  }

  protected fecharHistoria() {
    this.historiaAberta.set(false);
  }
}