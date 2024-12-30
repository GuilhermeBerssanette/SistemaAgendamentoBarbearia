import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Firestore, collection, getDocs, doc, setDoc} from '@angular/fire/firestore';
import { NgForOf, NgIf } from "@angular/common";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-register-service',
  templateUrl: './modal-register-service.component.html',
  styleUrl: './modal-register-service.component.scss',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatIcon
  ],
  standalone: true
})
export class ModalRegisterServiceComponent implements OnInit {
  form: FormGroup;
  availableServices = ['Cabelo', 'Barba', 'Sobrancelha'];
  filteredServices: string[] = [];

  constructor(
    private firestore: Firestore,
    private dialogRef: MatDialogRef<ModalRegisterServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string; barbeariaId: string }
  ) {
    this.form = new FormGroup({
      service: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.filterAvailableServices()
  }

  async filterAvailableServices() {

    const servicesCollectionRef = collection(
      this.firestore,
      `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/services`
    );
    const servicesSnapshot = await getDocs(servicesCollectionRef);

    const registeredServices = servicesSnapshot.docs.map(doc => doc.id);

    this.filteredServices = this.availableServices.filter(service => !registeredServices.includes(service));
  }

  async onSubmit() {
    if (this.form.valid) {
      const serviceData = {
        price: this.form.value.price,
        duration: this.form.value.duration,
      };

      const serviceName = this.form.value.service;
      const serviceRef = doc(
        this.firestore,
        `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/services`,
        serviceName
      );

      try {
        await setDoc(serviceRef, serviceData);
        this.dialogRef.close(true);
      } catch (error) {
        return;
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
