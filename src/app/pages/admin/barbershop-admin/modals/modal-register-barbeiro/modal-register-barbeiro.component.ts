import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';
import { Barbeiros } from '../../../../../interfaces/barbeiros';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-register-barbeiro',
  templateUrl: './modal-register-barbeiro.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgIf],
  styleUrls: ['./modal-register-barbeiro.component.scss']
})
export class ModalRegisterBarbeiroComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { barbeariaId: string },
    private firestore: Firestore,
    public dialogRef: MatDialogRef<ModalRegisterBarbeiroComponent>
  ) {
    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      rg: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      whats: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      instagram: new FormControl(''),
      facebook: new FormControl(''),
      tiktok: new FormControl(''),
      twitter: new FormControl(''),
      atendeAutista: new FormControl(false),
      atendeCrianca: new FormControl(false),
      atendeDomicilio: new FormControl(false),
      experienciaCrespo: new FormControl(false),
      servicoEventos: new FormControl(false),
    });
  }

  async addBarberToBarbearia() {
    if (this.form.valid) {
      // Gerando um novo ID automaticamente
      const barbersCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/barbers`);
      const newBarberDocRef = doc(barbersCollectionRef); // O Firestore gera o ID automaticamente

      const barberData: Barbeiros = {
        id: newBarberDocRef.id, // Usando o ID gerado automaticamente
        nome: this.form.value.nome,
        rg: this.form.value.rg,
        cpf: this.form.value.cpf,
        telefone: this.form.value.telefone,
        whats: this.form.value.whats,
        email: this.form.value.email,
        instagram: this.form.value.instagram || '',
        facebook: this.form.value.facebook || '',
        tiktok: this.form.value.tiktok || '',
        twitter: this.form.value.twitter || '',
        atendeAutista: this.form.value.atendeAutista,
        atendeCrianca: this.form.value.atendeCrianca,
        atendeDomicilio: this.form.value.atendeDomicilio,
        experienciaCrespo: this.form.value.experienciaCrespo,
        servicoEventos: this.form.value.servicoEventos,
      };

      await setDoc(newBarberDocRef, barberData);
      alert('Barbeiro registrado com sucesso!');
      this.dialogRef.close();
    }
  }
}
