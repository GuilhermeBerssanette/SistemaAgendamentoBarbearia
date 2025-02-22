import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { collection, doc, Firestore, getDoc, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Barbearias } from "../../../interfaces/barbearias";
import { Barbeiros } from "../../../interfaces/barbeiros";
import { ModalInfoComponent } from "./modals/modal-info/modal-info.component";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { ModalCommentComponent } from "./modals/modal-comment/modal-comment.component";
import { HeaderAdminComponent } from "../../../components/header-admin/header-admin.component";
import { Auth } from "@angular/fire/auth";

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MatIcon, HeaderAdminComponent],
  templateUrl: './barbershop.component.html',
  styleUrls: ['./barbershop.component.scss']
})
export class BarbershopComponent implements OnInit {
  barbearia?: Barbearias;
  barbeariaId?: string;
  barbers: Barbeiros[] = [];
  isFavorite = false;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private auth: Auth
  ) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.auth.onAuthStateChanged(async user => {
      this.user = user;
      if (user) {
        await this.checkIfFavorite();
      }
    });

    if (this.barbeariaId) {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);
      if (barbeariaDoc.exists()) {
        this.barbearia = { id: barbeariaDoc.id, ...barbeariaDoc.data() } as unknown as Barbearias;
      }

      const barbersCollection = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const querySnapshot = await getDocs(barbersCollection);

      this.barbers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Barbeiros[];
    }
  }

  isAddressValid(): boolean {
    return !!(this.barbearia?.estado && this.barbearia?.cidade && this.barbearia?.rua);
  }

  openGoogleMaps(): void {
    if (this.isAddressValid()) {
      const { estado, cidade, rua, numero } = this.barbearia!;
      const address = `${rua}, ${numero ? numero + ', ' : ''}${cidade}, ${estado}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

      try {
        const newWindow = window.open(url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          alert('Endereço não encontrado. Verifique as informações fornecidas.');
        }
      } catch (error) {
        return;
      }
    }
  }

  openModalInfos(barber: Barbeiros, event: Event): void {
    event.stopPropagation();
    this.dialog.open(ModalInfoComponent, {
      width: '300px',
      data: {
        barber,
        barbeariaId: this.barbeariaId
      }
    });
  }

  openModalComment(): void {
    this.dialog.open(ModalCommentComponent, {
      width: '1000px',
      height: '600px',
      data: { barbeariaId: this.barbeariaId }
    });
  }

  async checkIfFavorite() {
    if (!this.user || !this.barbeariaId) return;

    const favoriteDocRef = doc(this.firestore, `users/${this.user.uid}/favorites/${this.barbeariaId}`);
    const docSnap = await getDoc(favoriteDocRef);
    this.isFavorite = docSnap.exists();
  }

  async toggleFavorite() {
    if (!this.user || !this.barbeariaId) return;

    const favoriteDocRef = doc(this.firestore, `users/${this.user.uid}/favorites/${this.barbeariaId}`);
    if (this.isFavorite) {
      await deleteDoc(favoriteDocRef);
      this.isFavorite = false;
    } else {
      await setDoc(favoriteDocRef, { barbeariaId: this.barbeariaId, dateAdded: new Date() });
      this.isFavorite = true;
    }
  }
}
