import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import {NgIf} from "@angular/common";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-edit-service',
  templateUrl: './modal-edit-service.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIcon
  ],
  styleUrls: ['./modal-edit-service.component.scss']
})
export class ModalEditServiceComponent {
  firestore = inject(Firestore);

  form: FormGroup = new FormGroup({
    price: new FormControl(this.data.service.price, [Validators.required]),
    duration: new FormControl(this.data.service.duration, [Validators.required]),
  });

  constructor(
    private dialogRef: MatDialogRef<ModalEditServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string, barbeariaId: string, service: any }
  ) {}

  async saveService() {
    const serviceDocRef = doc(
      this.firestore,
      `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/services/${this.data.service.id}`
    );

    try {
      await updateDoc(serviceDocRef, {
        price: this.form.value.price,
        duration: this.form.value.duration
      });

      this.dialogRef.close(true);
    } catch (error) {
      return;
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
