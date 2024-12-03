import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  register(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password).then(async (response) => {
      await updateProfile(response.user, { displayName: email });
      await setDoc(doc(this.firestore, 'users', response.user.uid), {
        email: email,
        userType: 'client'
      });
    });

    return from(promise);
  }
}
