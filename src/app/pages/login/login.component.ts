import { CommonModule } from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, Auth, user} from "@angular/fire/auth";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router)
  private auth = inject(Auth);
  provider = new GoogleAuthProvider();

  form = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })

  onSubmit(): void {

    let email = this.form.controls.email.getRawValue();
    let pass = this.form.controls.password.getRawValue();

    if(email == null || pass == null) return;

    signInWithEmailAndPassword(this.auth, email, pass)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }


    loginWithGoogle()
    {
      signInWithPopup(this.auth, this.provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // this.router.navigate(['/', 'register']);
        console.log(credential)
        return credential;
      })
    }
  }


// canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   const authPipeFactory = next.data['authGuardPipe'] as AuthPipeGenerator || (() => loggedIn);
//   return user(this.auth).pipe(
//     take(1),
//     authPipeFactory(next, state),
//     map(can => {
//       if (typeof can === 'boolean') {
//         return can;
//       } else if (Array.isArray(can)) {
//         return this.router.createUrlTree(can);
//       } else {
//         return this.router.parseUrl(can);
//       }
//     })
//   );
// }
