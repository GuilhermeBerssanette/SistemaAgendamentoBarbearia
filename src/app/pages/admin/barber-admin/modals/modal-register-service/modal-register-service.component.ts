import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc, arrayUnion, getDoc } from '@angular/fire/firestore';
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

    // Chama a função que carrega os serviços disponíveis e trata a Promise corretamente
    this.initializeForm().catch(error => {
      console.error('Erro ao inicializar o formulário:', error);
    });
  }

  // Função async para inicializar o formulário, aguardando o carregamento dos serviços
  async initializeForm() {
    try {
      await this.loadAvailableServices(); // Aguarda a Promise ser resolvida
    } catch (error) {
      console.error('Erro ao carregar serviços disponíveis:', error);
    }
  }

  // Função para carregar os serviços disponíveis que ainda não estão registrados
  async loadAvailableServices() {
    const { barberId, barbeariaId } = this.data;

    const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
    const barberDocSnapshot = await getDoc(barberDocRef);

    if (barberDocSnapshot.exists()) {
      const barberData = barberDocSnapshot.data();
      const registeredServices = barberData?.['services'] || [];

      // Filtra os serviços disponíveis removendo os já registrados
      this.availableServices = this.services.filter(service =>
        !registeredServices.some((registeredService: any) => registeredService.name === service)
      );
    } else {
      console.error('Documento do barbeiro não encontrado!');
    }
  }

  // Função para registrar um novo serviço
  async registerService() {
    if (this.serviceForm.valid) {
      const serviceData = {
        ...this.serviceForm.value,
        name: this.serviceForm.value.name,
      };
      const { barberId, barbeariaId } = this.data;

      const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);

      try {
        // Adiciona o serviço ao array de serviços já existentes
        await updateDoc(barberDocRef, {
          services: arrayUnion(serviceData)
        });
        this.dialogRef.close();
      } catch (error) {
        console.error('Erro ao cadastrar o serviço:', error);
      }
    }
  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
