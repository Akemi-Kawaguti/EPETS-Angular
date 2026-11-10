import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly router = inject(Router);
  protected readonly hoje = new Date();

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { requireSync: true },
  );

  protected readonly titulo = computed(() => {
    const path = this.url().split('?')[0];
    if (path.startsWith('/admin/produtos')) return 'Produtos';
    if (path.startsWith('/admin/movimentacoes')) return 'Movimentações';
    return 'Visão geral';
  });
}
