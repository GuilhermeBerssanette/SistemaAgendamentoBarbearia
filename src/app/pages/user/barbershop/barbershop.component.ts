import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

import { CommonModule } from '@angular/common';
import {Barbearias} from "../../../interfaces/barbearias"; // importando o CommonModule

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [CommonModule, RouterLink], // garantindo que o CommonModule esteja importado
  templateUrl: './barbershop.component.html',
  styleUrls: ['./barbershop.component.scss']
})
export class BarbershopComponent implements OnInit {
  barbearia?: Barbearias;
  id?: string;
  barbeariaId?: string;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    const docRef = doc(this.firestore, `barbearia/${this.id}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Barbearias;
      this.barbearia = {
        ...data,
        barbers: data.barbers || []
      };
    } else {
      console.log('Barbearia não encontrada');
    }
  }

  protected readonly encodeURIComponent = encodeURIComponent;
}
