import { Injectable } from '@angular/core';
import { Firestore, doc, collection, addDoc, getDocs, setDoc, query, where } from '@angular/fire/firestore';
import { Barbearias } from '../interfaces/barbearias';
import { Barbeiros } from "../interfaces/barbeiros";

@Injectable({
  providedIn: 'root'
})
export class BarbeariasService {
  constructor(private firestore: Firestore) {}

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
    const barberId = doc(collection(this.firestore, `barbearia/${barbeariaId}/barbers`)).id;
    const barberWithId = {
      ...barberData,
      id: barberId
    };
    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers`, barberId);
    return setDoc(barberDocRef, barberWithId);
  }

  async hasBarbershop(userId: string): Promise<boolean> {
    const barbeariaCollection = collection(this.firestore, 'barbearia');
    const q = query(barbeariaCollection, where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async getBarbershopId(userId: string): Promise<string | null> {
    const barbeariaCollection = collection(this.firestore, 'barbearia');
    const q = query(barbeariaCollection, where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.id;
    }

    return null;
  }
}
