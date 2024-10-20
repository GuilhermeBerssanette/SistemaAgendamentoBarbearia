import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Firestore, doc, setDoc, collection, getDoc} from '@angular/fire/firestore';
import { Barbeiros } from '../../../../../interfaces/barbeiros';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { NgIf } from '@angular/common';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-modal-register-barbeiro',
  templateUrl: './modal-register-barbeiro.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgIf],
  styleUrls: ['./modal-register-barbeiro.component.scss']
})
export class ModalRegisterBarbeiroComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  storage = getStorage();

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


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async addBarberToBarbearia() {
    if (this.form.valid && this.selectedFile) {
      const barbersCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/barbers`);
      const newBarberDocRef = doc(barbersCollectionRef);

      const filePath = `profile/${Date.now()}_${this.selectedFile!.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

      uploadTask.on('state_changed',
        () => {},
        (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        },
        async () => {
          this.downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const barberData: Barbeiros = {
            id: newBarberDocRef.id,
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
            profileImageUrl: this.downloadURL,
          };

          // Salva os dados do barbeiro
          await setDoc(newBarberDocRef, barberData);

          // Verifica e atualiza o registro da barbearia
          const barbeariaRef = doc(this.firestore, `barbearia/${this.data.barbeariaId}`);
          const barbeariaDoc = await getDoc(barbeariaRef);

          const barbeariaData = barbeariaDoc.exists() ? barbeariaDoc.data() : {};

          // Atualiza apenas se o valor for verdadeiro (e não undefined)
          const updatedBarbeariaData = {
            ...(barberData.atendeAutista ? { atendeAutista: true } : {}),
            ...(barberData.atendeCrianca ? { atendeCrianca: true } : {}),
            ...(barberData.atendeDomicilio ? { atendeDomicilio: true } : {}),
            ...(barberData.experienciaCrespo ? { experienciaCrespo: true } : {}),
            ...(barberData.servicoEventos ? { servicoEventos: true } : {}),
          };

          // Atualiza o documento da barbearia, mesclando as mudanças
          await setDoc(barbeariaRef, updatedBarbeariaData, { merge: true });

          alert('Barbeiro registrado com sucesso e barbearia atualizada!');
          this.dialogRef.close();
        }
      );
    }
  }

}
