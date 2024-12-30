import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForOf, NgIf } from "@angular/common";
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-favorites',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatIcon
  ],
  templateUrl: './modal-favorites.component.html',
  styleUrls: ['./modal-favorites.component.scss']
})
export class ModalFavoritesComponent implements OnInit {
  favoriteBarbearias: any[] = [];
  userEmail?: string;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private dialogRef: MatDialogRef<ModalFavoritesComponent>,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email || undefined;

      const favoritesCollection = collection(this.firestore, `users/${user.uid}/favorites`);
      const favoritesSnapshot = await getDocs(favoritesCollection);

      this.favoriteBarbearias = await Promise.all(
        favoritesSnapshot.docs.map(async favoriteDoc => {
          const barbeariaId = favoriteDoc.data()['barbeariaId'];
          if (barbeariaId) {
            const barbeariaDoc = await getDoc(doc(this.firestore, `barbearia/${barbeariaId}`));
            return barbeariaDoc.exists() ? { id: barbeariaId, ...barbeariaDoc.data() } : null;
          }
          return null;
        })
      );

      this.favoriteBarbearias = this.favoriteBarbearias.filter(barbearia => barbearia !== null);
    }
  }

  async navigateToBarbearia(barbeariaId: string) {
    this.dialogRef.close();
    await this.router.navigate(['/barbearia', barbeariaId]);
  }

  closeModal(){
    this.dialogRef.close();
  }

}
