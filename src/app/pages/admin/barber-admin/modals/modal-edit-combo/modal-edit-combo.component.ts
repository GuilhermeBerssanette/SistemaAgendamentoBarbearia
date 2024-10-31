import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { Firestore, doc, updateDoc, getDoc, getDocs, collection } from '@angular/fire/firestore';
import {NgForOf, NgIf} from "@angular/common";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-edit-combo',
  templateUrl: './modal-edit-combo.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatIcon
  ],
  styleUrls: ['./modal-edit-combo.component.scss']
})
export class ModalEditComboComponent {
  firestore = inject(Firestore);
  form: FormGroup;
  comboServices: { id: string, duration: number }[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalEditComboComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string, barbeariaId: string, combo: any }
  ) {

    this.form = new FormGroup({
      price: new FormControl(this.data.combo.price, [Validators.required]),
      duration: new FormControl(this.data.combo.duration, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.loadComboServices();
  }

  async loadComboServices() {

    const servicesCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/services`);
    const servicesSnapshot = await getDocs(servicesCollectionRef);

    const allServices = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      duration: doc.data()['duration'] || 0
    }));

    const comboDocRef = doc(this.firestore, `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/combos/${this.data.combo.id}`);
    const comboDoc = await getDoc(comboDocRef);

    if (comboDoc.exists()) {
      const comboData = comboDoc.data();
      const selectedServices = comboData['services'] || [];

      this.comboServices = selectedServices.map((serviceId: string) => {
        const serviceData = allServices.find(service => service.id === serviceId);
        return {
          id: serviceId,
          duration: serviceData?.duration || 0
        };
      });
    } else {
      console.error('Combo não encontrado!');
    }
  }

  async saveCombo() {
    const comboDocRef = doc(
      this.firestore,
      `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/combos/${this.data.combo.id}`
    );

    try {
      await updateDoc(comboDocRef, {
        price: this.form.value.price,
        duration: this.form.value.duration
      });

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Erro ao atualizar o combo:', error);
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  closeModalComment(): void {
    this.dialogRef.close();
  }
}
