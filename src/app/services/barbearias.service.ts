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
    const barbeariasCollection = collection(this.firestore, 'barbearia');
    const barbeariasSnapshot = await getDocs(barbeariasCollection);
    return barbeariasSnapshot.docs.map(doc => doc.data());
  }

}
