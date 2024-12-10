import { MatIcon } from '@angular/material/icon';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, collection, getDocs, setDoc, doc } from '@angular/fire/firestore';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-modal-register-combo',
  templateUrl: './modal-register-combo.component.html',
  styleUrl: './modal-register-combo.component.scss',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MatIcon
  ],
  standalone: true
})
export class ModalRegisterComboComponent implements OnInit {
  form: FormGroup;
  registeredServices: { id: string, duration: number }[] = [];
  totalDuration = 0;
  anyServiceSelected = false;
  dialog: any;

  constructor(
    private firestore: Firestore,
    private dialogRef: MatDialogRef<ModalRegisterComboComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string; barbeariaId: string }
  ) {
    this.form = new FormGroup({
      price: new FormControl('', [Validators.required])
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadRegisteredServices();
    this.initializeFormControls();
  }

  async loadRegisteredServices() {
    const servicesCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/services`);
    const servicesSnapshot = await getDocs(servicesCollectionRef);

    this.registeredServices = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      duration: doc.data()['duration']
    }));
  }

  initializeFormControls(): void {
    this.registeredServices.forEach(service => {
      this.form.addControl(service.id, new FormControl(false));
    });
  }

  onServiceSelectionChange(): void {
    this.updateTotalDuration();
    this.checkIfAnyServiceSelected();
  }

  updateTotalDuration(): void {
    let duration = 0;
    this.registeredServices.forEach(service => {
      if (this.form.get(service.id)?.value) {
        duration += Number(service.duration);
      }
    });
    this.totalDuration = duration;
  }

  checkIfAnyServiceSelected(): void {
    this.anyServiceSelected = this.registeredServices.some(service => this.form.get(service.id)?.value);
  }

  async onSubmit() {
    if (this.form.valid && this.anyServiceSelected) {
      const selectedServices = this.registeredServices
        .filter(service => this.form.get(service.id)?.value)
        .map(service => service.id);

      const comboData = {
        price: this.form.value.price,
        duration: this.totalDuration,
        services: selectedServices
      };

      const comboRef = doc(this.firestore, `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/combos`, `combo_${new Date().getTime()}`);

      try {
        await setDoc(comboRef, comboData);
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Erro ao registrar o combo:', error);
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  openModal(): void {
    this.dialog.open(ModalRegisterComboComponent, {
      width: '600px', // Largura do modal
      height: '500px', // Altura do modal
      maxWidth: '90vw', // Responsivo: limite de largura máxima
      data: {
        barberId: 'exampleBarberId',
        barbeariaId: 'exampleBarbeariaId',
      },
    });
  }
}
