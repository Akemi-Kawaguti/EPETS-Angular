import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { CartService } from '../../services/cart';

export const ACESSORIOS = ['Caminhas', 'Coleiras', 'Brinquedos', 'Comedouros e bebedouros', 'Higiene'];

interface NavItem {
  label: string;
  path: string;
  params?: Record<string, string | string[]>;
  fragment?: string;
  key: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  protected readonly cart = inject(CartService);

  protected readonly nav: NavItem[] = [
    { key: 'todos', label: 'Todos os produtos', path: '/catalogo' },
    { key: 'Cães', label: 'Cães', path: '/catalogo', params: { pet: 'Cães' } },
    { key: 'Gatos', label: 'Gatos', path: '/catalogo', params: { pet: 'Gatos' } },
    { key: 'Roedores', label: 'Roedores', path: '/catalogo', params: { pet: 'Roedores' } },
    { key: 'Aves silvestres', label: 'Aves silvestres', path: '/catalogo', params: { pet: 'Aves silvestres' } },
    { key: 'acessorios', label: 'Acessórios', path: '/catalogo', params: { cat: ACESSORIOS } },
    { key: 'marcas', label: 'Nossas marcas', path: '/', fragment: 'marcas' },
  ];

  private readonly tree = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url)),
      startWith(this.router.parseUrl(this.router.url)),
    ),
    { requireSync: true },
  );

  /** qual item do menu está ativo, de acordo com a URL */
  protected readonly activeKey = computed(() => {
    const t = this.tree();
    const path = '/' + t.root.children['primary']?.segments.map((s) => s.path).join('/');
    if (path !== '/catalogo') return t.fragment === 'marcas' ? 'marcas' : '';
    const q = t.queryParams;
    if (q['cat']) return 'acessorios';
    if (q['pet'] && !Array.isArray(q['pet'])) return q['pet'] as string;
    return q['pet'] ? '' : 'todos';
  });

  protected buscar(termo: string): void {
    const q = termo.trim();
    this.router.navigate(['/catalogo'], { queryParams: q ? { q } : {} });
  }
}
