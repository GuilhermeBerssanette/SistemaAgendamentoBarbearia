import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, Auth } from "@angular/fire/auth";
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  provider = new GoogleAuthProvider();

  form = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit(): Promise<void> {
    const email = this.form.get('email')?.value;
    const pass = this.form.get('password')?.value;

    if (!email || !pass) return;

    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      console.log("Login successful");
      await this.redirectUserBasedOnRole();
    } catch (error) {
      console.error('Erro ao fazer login:', error instanceof Error ? error.message : error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await signInWithPopup(this.auth, this.provider);
      console.log("Google login successful");
      await this.redirectUserBasedOnRole();
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error instanceof Error ? error.message : error);
    }
  }

  private async redirectUserBasedOnRole(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      const barbeariaQuery = query(
        collection(this.firestore, 'barbearia'),
        where('ownerId', '==', user.uid)
      );
      const barbeariaSnapshot = await getDocs(barbeariaQuery);

      if (!barbeariaSnapshot.empty) {
        const barbeariaId = barbeariaSnapshot.docs[0].id;
        await this.router.navigateByUrl(`/barbearia/${barbeariaId}/admin`);
        return;
      }

      const barbeariaCollectionRef = collection(this.firestore, 'barbearia');
      const barbeariaDocs = await getDocs(barbeariaCollectionRef);

      for (const barbeariaDoc of barbeariaDocs.docs) {
        const barbeariaId = barbeariaDoc.id;
        const barbersCollectionRef = collection(this.firestore, `barbearia/${barbeariaId}/barbers`);
        const barberQuery = query(barbersCollectionRef, where('id', '==', user.uid));
        const barberSnapshot = await getDocs(barberQuery);

        if (!barberSnapshot.empty) {
          const barberId = barberSnapshot.docs[0].id;
          await this.router.navigateByUrl(`/barbearia/${barbeariaId}/barber/${barberId}/admin`);
          return;
        }
      }

      await this.router.navigateByUrl('/initial-page');
    } catch (error) {
      console.error("Erro ao redirecionar após o login:", error);
      await this.router.navigateByUrl('/initial-page');
    }
  }
}
