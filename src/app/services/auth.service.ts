import {inject, Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, updateProfile} from "@angular/fire/auth";
import {from, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)

  register(
    email:string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response)=>
      updateProfile(response.user, {displayName: email}),
      );

    return from(promise);
  }

  constructor() { }
}
