import {inject, Injectable} from '@angular/core';
import { Firestore} from '@angular/fire/firestore';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Barbeiro} from "../interfaces/barbeiro";

@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {
  firestore = inject(Firestore);

  constructor(private dataBaseStore: AngularFirestore) { }

  addUser(barbeiro: Barbeiro) {
    return this.dataBaseStore.collection('barbeiro').add(barbeiro);
  }
}
