import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, Auth, sendPasswordResetEmail } from "@angular/fire/auth";
import { Firestore, collection, query, where, getDocs, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { MatDialog } from "@angular/material/dialog";
import { ModalRecoveryPasswordComponent } from "./modals/modal-recovery-password/modal-recovery-password.component";

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
  dialog = inject(MatDialog);

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
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;

      if (!user) {
        console.error('Usuário não encontrado após login com Google.');
        return;
      }

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          userType: 'client'
        });
        console.log('Novo usuário adicionado ao Firestore.');
      }

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
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.warn('Usuário não encontrado no Firestore.');
        await this.router.navigate(['/login']);
        return;
      }

      const userType = userDoc.data()?.['userType'];

      if (userType === 'client') {
        await this.router.navigate(['/initial-page']);
      } else if (userType === 'barber') {
        const barbeariaCollectionRef = collection(this.firestore, 'barbearia');
        const barbeariaDocs = await getDocs(barbeariaCollectionRef);

        for (const barbeariaDoc of barbeariaDocs.docs) {
          const barbeariaId = barbeariaDoc.id;
          const barbersCollectionRef = collection(this.firestore, `barbearia/${barbeariaId}/barbers`);
          const barberDocRef = doc(barbersCollectionRef, user.uid);
          const barberDoc = await getDoc(barberDocRef);

          if (barberDoc.exists()) {
            await this.router.navigateByUrl(`/barbearia/${barbeariaId}/barber/${user.uid}/admin`);
            return;
          }
        }

        console.warn('Barbearia não encontrada para o barbeiro.');
        await this.router.navigate(['/initial-page']);
      } else if (userType === 'admin') {
        const adminQuery = query(
          collection(this.firestore, 'barbearia'),
          where('ownerId', '==', user.uid)
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const barbeariaId = adminSnapshot.docs[0].id;
          await this.router.navigateByUrl(`/barbearia/${barbeariaId}/admin`);
          return;
        }

        console.warn('Barbearia não encontrada para o admin.');
        await this.router.navigate(['/initial-page']);
      } else {
        console.warn('Tipo de usuário desconhecido. Redirecionando para login.');
        await this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Erro ao redirecionar usuário:', error);
      await this.router.navigate(['/login']);
    }
  }

  openRecoveryModal(): void {
    const dialogRef = this.dialog.open(ModalRecoveryPasswordComponent, {
      width: '400px',
      height: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((email) => {
      if (email) {
        this.sendPasswordResetEmail(email);
      }
      console.log('Modal de recuperação de senha fechado');
    });
  }

  private async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log(`E-mail de recuperação de senha enviado para ${email}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error instanceof Error ? error.message : error);
    }
  }
}
