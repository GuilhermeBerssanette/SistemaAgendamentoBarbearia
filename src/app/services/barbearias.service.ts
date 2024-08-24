import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Barbearias } from '../interfaces/barbearias';

@Injectable({
  providedIn: 'root'
})
export class BarbeariasService {

  constructor(private firestore: Firestore) { }

  addBarbearia(barbearias: Barbearias) {
    const barbearia = collection(this.firestore, 'barbearia');
    return addDoc(barbearia, barbearias);
  }
}
