import { Component, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Firestore, doc, setDoc, getDoc} from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-modal-register-service',
  standalone: true,
  templateUrl: './modal-register-service.component.html',
  styleUrls: ['./modal-register-service.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ]
})
export class ModalRegisterServiceComponent {
  serviceForm: FormGroup;
  services: string[] = ['barba', 'cabelo', 'sobrancelha'];
  availableServices: string[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    public dialogRef: MatDialogRef<ModalRegisterServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string, barbeariaId: string }
  ) {
    this.serviceForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required, Validators.min(1)]),
      duration: new FormControl('', [Validators.required, Validators.min(1)]),
    });

    this.initializeForm().catch(error => {
      console.error('Erro ao inicializar o formulário:', error);
    });
  }

  async initializeForm() {
    try {
      await this.loadAvailableServices();
    } catch (error) {
      console.error('Erro ao carregar serviços disponíveis:', error);
    }
  }

  async loadAvailableServices() {
    const { barberId, barbeariaId } = this.data;

    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
    const barberDocSnapshot = await getDoc(barberDocRef);

    if (barberDocSnapshot.exists()) {
      const barberData = barberDocSnapshot.data();
      const registeredServices = barberData?.['services'] || {};

      this.availableServices = this.services.filter(service =>
        !Object.keys(registeredServices).includes(service) // Use keys to prevent duplicates
      );
    } else {
      console.error('Documento do barbeiro não encontrado!');
    }
  }

  async registerService() {
    if (this.serviceForm.valid) {
      const serviceData = {
        value: this.serviceForm.value.value,
        duration: this.serviceForm.value.duration
      };

      const {barberId, barbeariaId} = this.data;
      const serviceName = this.serviceForm.value.name;

      try {

        const serviceDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}/services/${serviceName}`);
        await setDoc(serviceDocRef, serviceData);
        this.dialogRef.close();
      } catch (error) {
        console.error('Erro ao cadastrar o serviço:', error);
      }

    }

  }
  closeModal()
  {
    this.dialogRef.close();
  }
  }

