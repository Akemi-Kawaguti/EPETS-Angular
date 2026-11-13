import { Routes } from '@angular/router';
import { adminGuard, visitanteGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ---------- entrar / criar conta (tela própria, sem header e footer)
  {
    path: 'entrar',
    canActivate: [visitanteGuard],
    data: { modo: 'entrar' },
    title: 'Entrar • E’PETS',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },
  {
    path: 'cadastro',
    canActivate: [visitanteGuard],
    data: { modo: 'cadastro' },
    title: 'Criar conta • E’PETS',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },

  // ---------- loja (header + footer)
  {
    path: '',
    loadComponent: () => import('./layout/shop-layout/shop-layout').then((m) => m.ShopLayout),
    children: [
      { path: '', pathMatch: 'full', title: 'E’PETS • Rações e acessórios', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      { path: 'catalogo', title: 'Todos os produtos • E’PETS', loadComponent: () => import('./pages/catalog/catalog').then((m) => m.Catalog) },
      { path: 'produto/:id', title: 'Produto • E’PETS', loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail) },
      { path: 'sacola', title: 'Sua sacola • E’PETS', loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage) },
      { path: 'checkout', title: 'Finalizar compra • E’PETS', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout) },
      { path: 'confirmacao/:id', title: 'Pedido confirmado • E’PETS', loadComponent: () => import('./pages/confirmation/confirmation').then((m) => m.Confirmation) },
    ],
  },

  // ---------- painel admin
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', title: 'Visão geral • E’PETS Admin', loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'produtos', title: 'Produtos • E’PETS Admin', loadComponent: () => import('./admin/products/products').then((m) => m.AdminProducts) },
      { path: 'movimentacoes', title: 'Movimentações • E’PETS Admin', loadComponent: () => import('./admin/movements/movements').then((m) => m.AdminMovements) },
    ],
  },

  { path: '**', redirectTo: '' },
];