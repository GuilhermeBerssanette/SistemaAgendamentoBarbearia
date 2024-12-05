import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const canActivateAuthGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return authState(auth).pipe(
    switchMap(async (user) => {
      if (!user) {
        console.warn('Usuário não autenticado. Redirecionando para login.');
        await router.navigate(['/login']);
        return false;
      }

      const userDocRef = doc(firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.warn('Usuário não encontrado no Firestore. Redirecionando para login.');
        await router.navigate(['/login']);
        return false;
      }

      const userType = userDoc.data()?.['userType'];
      const requestedUrl = state.url;

      if (userType === 'admin') {
        if (!requestedUrl.includes('/admin')) {
          console.warn('Admin não pode acessar áreas de cliente ou barbeiro. Redirecionando.');
          await router.navigate(['/barbearia', route.params['id'], 'admin']);
          return false;
        }
      }

      if (userType === 'barber') {
        const barberId = route.params['barberId'];
        const barbeariaId = route.params['id'];

        if (!barberId || !barbeariaId) {
          console.warn('Barbeiro tentando acessar área inválida. Redirecionando.');
          await router.navigate(['/initial-page']);
          return false;
        }

        const barberDocRef = doc(firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
        const barberDoc = await getDoc(barberDocRef);

        if (!barberDoc.exists() || barberDoc.data()?.['id'] !== user.uid) {
          console.warn('Barbeiro tentando acessar área não autorizada. Redirecionando.');
          await router.navigate(['/initial-page']);
          return false;
        }

        if (!requestedUrl.startsWith(`/barbearia/${barbeariaId}/barber/${barberId}/admin`)) {
          console.warn('Barbeiro tentando acessar área inválida. Redirecionando.');
          await router.navigate(['/barbearia', barbeariaId, 'barber', barberId, 'admin']);
          return false;
        }
      }

      if (userType === 'client') {
        if (requestedUrl.includes('/admin')) {
          console.warn('Clientes não podem acessar áreas de admin. Redirecionando.');
          await router.navigate(['/initial-page']);
          return false;
        }
      }

      return true;
    }),
    catchError(async (error) => {
      console.error('Erro no Auth Guard:', error);
      await router.navigate(['/login']);
      return false;
    })
  );
};
