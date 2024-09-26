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
  barbeiro?: Barbeiros; // O barbeiro que será exibido
  barbeariaId?: string; // O ID da barbearia
  barberId?: string; // O ID do barbeiro

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {

    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.barberId = this.route.snapshot.paramMap.get('barberId')!;

    if (this.barbeariaId && this.barberId) {
      const docRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barberId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.barbeiro = docSnap.data() as Barbeiros;
      }
    }
  }
}
