import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/** Só deixa entrar no painel quem é administrador. */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAdmin()) return true;
  return inject(Router).createUrlTree(['/entrar'], { queryParams: { redirect: state.url } });
};

/** Quem já está logado não precisa ver a tela de entrar / criar conta. */
export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (!auth.logado()) return true;
  return inject(Router).createUrlTree([auth.isAdmin() ? '/admin' : '/']);
};