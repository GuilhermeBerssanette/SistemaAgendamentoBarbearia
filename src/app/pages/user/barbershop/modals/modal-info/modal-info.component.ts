import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Barbeiros } from "../../../../../interfaces/barbeiros";
import { NgIf, NgForOf, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

interface Service {
  id: string;
  duration: number;
  price: number;
}

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    MatIcon
  ],
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {
  services: Service[] = [];
  barbeariaId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { barber: Barbeiros, barbeariaId: string },
    private dialogRef: MatDialogRef<ModalInfoComponent>,
    private firestore: Firestore
  ) {
    this.barbeariaId = data.barbeariaId;
  }

  ngOnInit(): void {
    this.loadServices();
  }

  async loadServices() {
    try {
      const servicesCollection = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.data.barber.id}/services`);
      const querySnapshot = await getDocs(servicesCollection);
      this.services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error) {
      return;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  closeModalInfo(){
    this.dialogRef.close();
  }
}
