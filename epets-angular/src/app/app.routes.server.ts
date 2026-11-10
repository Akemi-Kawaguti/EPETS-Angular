import { RenderMode, ServerRoute } from '@angular/ssr';

// A loja usa localStorage (sacola, estoque, pedidos), então renderiza no navegador.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Client }];
