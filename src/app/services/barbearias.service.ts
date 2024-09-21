import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, getDocs, arrayUnion, updateDoc, doc} from '@angular/fire/firestore';
import { Barbearias } from '../interfaces/barbearias';
import {Barbeiros} from "../interfaces/barbeiros";

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


  async addBarberToBarbearia(barbeariaId: string, barberData: Barbeiros) {
    const barbeariaDocRef = doc(this.firestore, 'barbearia', barbeariaId);
    return updateDoc(barbeariaDocRef, {
      barbers: arrayUnion(barberData)
    });
  }


}
