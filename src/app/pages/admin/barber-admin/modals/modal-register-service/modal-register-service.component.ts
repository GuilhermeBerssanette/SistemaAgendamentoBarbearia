import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Firestore, collection, getDocs, doc, setDoc} from '@angular/fire/firestore';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-modal-register-service',
  templateUrl: './modal-register-service.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
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
      .then(() => console.log('Serviços disponíveis filtrados com sucesso.'))
      .catch((error) => console.error('Erro ao filtrar serviços disponíveis:', error));
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
        console.error('Erro ao registrar o serviço:', error);
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
