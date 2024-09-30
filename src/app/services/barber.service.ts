import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class BarberService {
  constructor(private firestore: AngularFirestore) {}

  updateService(barberId: string, serviceName: string, updatedService: { nome: string; duracao: number; preco: number }) {
    const serviceRef = this.firestore.collection('barbearia').doc(barberId);

    return serviceRef.update({
      [`services.${serviceName}`]: updatedService
    });
  }
}
