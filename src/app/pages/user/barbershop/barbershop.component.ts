import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Barbearias } from "../../../interfaces/barbearias";
import { Barbeiros } from "../../../interfaces/barbeiros";
import { ModalInfoComponent } from "./modals/modal-info/modal-info.component";
import { MatDialog } from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MatIcon],
  templateUrl: './barbershop.component.html',
  styleUrls: ['./barbershop.component.scss']
})
export class BarbershopComponent implements OnInit {
  barbearia?: Barbearias;
  barbeariaId?: string;
  barbers: Barbeiros[] = [];

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;

    if (this.barbeariaId) {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);
      if (barbeariaDoc.exists()) {
        this.barbearia = {id: barbeariaDoc.id, ...barbeariaDoc.data()} as unknown as Barbearias;
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
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          alert('Endereço não encontrado. Verifique as informações fornecidas.');
        }
      } catch (error) {
        alert('Erro ao abrir o Google Maps. Por favor, tente novamente.');
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
}
