import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {collection, doc, Firestore, getDoc, getDocs} from '@angular/fire/firestore';

import { CommonModule } from '@angular/common';
import {Barbearias} from "../../../interfaces/barbearias";
import {Barbeiros} from "../../../interfaces/barbeiros"; // importando o CommonModule

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [CommonModule, RouterLink, ], // garantindo que o CommonModule esteja importado
  templateUrl: './barbershop.component.html',
  styleUrls: ['./barbershop.component.scss']
})
export class BarbershopComponent implements OnInit {
  barbearia?: Barbearias;
  id?: string;
  barbeariaId?: string;
  barbers: Barbeiros[] = [];

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;

    if (this.barbeariaId) {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);
      if (barbeariaDoc.exists()) {
        const barbeariaData = barbeariaDoc.data() as Barbearias;
        this.barbearia = {
          id: barbeariaDoc.id,
          ...barbeariaData,
        } as Barbearias;
      } else {
        console.error("Barbearia não encontrada!");
      }

      const barbersCollection = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const querySnapshot = await getDocs(barbersCollection);

      this.barbers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Barbeiros[];
    }

  }
}
