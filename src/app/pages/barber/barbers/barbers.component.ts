import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Barbeiros } from "../../../interfaces/barbeiros";

@Component({
  selector: 'app-barber',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barbers.component.html',
  styleUrls: ['./barbers.component.scss']
})
export class BarbersComponent implements OnInit {
  barbeiro?: Barbeiros;
  nome?: string;
  barbeariaId?: string;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    const barberIndex = this.route.snapshot.paramMap.get('barberIndex')!;

    console.log(`ID da Barbearia: ${this.barbeariaId}`);
    console.log(`Índice do Barbeiro: ${barberIndex}`);

    const docRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      this.barbeiro = data?.['barbers'][parseInt(barberIndex)];
      console.log(`Nome do Barbeiro: ${this.barbeiro?.nome}`);
    } else {
      console.log('Barbearia não encontrada');
    }
  }
}
