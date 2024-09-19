import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, getDocs} from '@angular/fire/firestore';
import { Barbearias } from '../interfaces/barbearias';

@Injectable({
  providedIn: 'root'
})
export class BarbeariasService {


  constructor(private firestore: Firestore) {
  }

  addBarbearia(barbearias: Barbearias) {
    const barbearia = collection(this.firestore, 'barbearia');
    return addDoc(barbearia, barbearias);
  }

  async getBarbearias() {
    const barbeariaCollection = collection(this.firestore, 'barbearia');
    const barbeariaSnapshot = await getDocs(barbeariaCollection);

    return barbeariaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

}
