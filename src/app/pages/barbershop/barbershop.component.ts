import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {doc, Firestore, getDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [],
  templateUrl: './barbershop.component.html',
  styleUrl: './barbershop.component.scss'
})
export class BarbershopComponent implements OnInit{
  barbearia: any;
  id?: string;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    const docRef = doc(this.firestore, `barbearia/${this.id}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.barbearia = docSnap.data();
    } else {
      console.log('Barbearia não encontrada');
    }
  }

}
