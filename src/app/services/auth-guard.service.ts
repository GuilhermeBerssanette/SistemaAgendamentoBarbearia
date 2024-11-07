import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export const canActivateAuthGuard = (): Observable<boolean> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map((user) => !!user),
    switchMap((isLoggedIn) => {
      if (!isLoggedIn) {
        console.warn('Redirecionando para login - usuário não autenticado');
        return router.navigate(['/login']).then(() => false);
      }
      return of(true);
    }),
    catchError(async (error) => {
      console.error('Erro no Auth Guard:', error);
      await router.navigate(['/login']);
      return false;
    })
  );
};
