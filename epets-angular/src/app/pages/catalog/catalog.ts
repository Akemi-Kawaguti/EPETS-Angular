import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { Product } from '../../models/product';
import { ProductService } from '../../services/products';

type Sort = 'relevancia' | 'menor' | 'maior' | 'nome';
type FilterKey = 'pet' | 'cat' | 'marca' | 'fase';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly products = inject(ProductService);

  // A URL é a fonte da verdade dos filtros (dá para compartilhar/voltar no navegador).
  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly q = computed(() => (this.params().get('q') ?? '').trim());
  protected readonly sort = computed(() => (this.params().get('ord') as Sort) ?? 'relevancia');
  protected readonly selected = computed(() => ({
    pet: this.params().getAll('pet'),
    cat: this.params().getAll('cat'),
    marca: this.params().getAll('marca'),
    fase: this.params().getAll('fase'),
  }));

  protected readonly groups: { key: FilterKey; titulo: string; pick: (p: Product) => string }[] = [
    { key: 'pet', titulo: 'Seu pet', pick: (p) => p.pet },
    { key: 'cat', titulo: 'Categoria', pick: (p) => p.category },
    { key: 'fase', titulo: 'Fase da vida', pick: (p) => p.fase },
    { key: 'marca', titulo: 'Marca', pick: (p) => p.brand },
  ];

  /** opções de cada grupo, com a contagem sobre o catálogo todo */
  protected readonly options = computed(() => {
    const all = this.products.items();
    return this.groups.map((g) => {
      const counts = new Map<string, number>();
      for (const p of all) counts.set(g.pick(p), (counts.get(g.pick(p)) ?? 0) + 1);
      const values = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      return { ...g, values };
    });
  });

  protected readonly result = computed(() => {
    const sel = this.selected();
    const q = norm(this.q());
    let list = this.products.items().filter((p) => {
      if (sel.pet.length && !sel.pet.includes(p.pet)) return false;
      if (sel.cat.length && !sel.cat.includes(p.category)) return false;
      if (sel.fase.length && !sel.fase.includes(p.fase)) return false;
      if (sel.marca.length && !sel.marca.includes(p.brand)) return false;
      if (q && !norm(`${p.name} ${p.brand} ${p.pet} ${p.category} ${p.detail}`).includes(q)) return false;
      return true;
    });
    switch (this.sort()) {
      case 'menor': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'maior': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'nome': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        // relevância: em estoque primeiro, destaques no topo
        list = [...list].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  });

  protected readonly hasFilters = computed(() => {
    const s = this.selected();
    return !!(this.q() || s.pet.length || s.cat.length || s.fase.length || s.marca.length);
  });

  protected readonly title = computed(() => {
    const pet = this.selected().pet;
    return pet.length === 1 ? `Tudo para ${petTitulo[pet[0]] ?? 'o seu companheiro'}.` : 'Tudo para o seu companheiro.';
  });

  protected isChecked(key: FilterKey, value: string): boolean {
    return this.selected()[key].includes(value);
  }

  protected toggle(key: FilterKey, value: string): void {
    const cur = this.selected()[key];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    this.router.navigate([], { relativeTo: this.route, queryParams: { [key]: next.length ? next : null }, queryParamsHandling: 'merge' });
  }

  protected setSort(value: string): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { ord: value === 'relevancia' ? null : value }, queryParamsHandling: 'merge' });
  }

  protected clear(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
}

const petTitulo: Record<string, string> = {
  'Cães': 'o seu cão',
  'Gatos': 'o seu gato',
  'Roedores': 'o seu roedor',
  'Aves silvestres': 'a sua ave',
};

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
