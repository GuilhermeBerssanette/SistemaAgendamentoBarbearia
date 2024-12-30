import { MatIcon } from '@angular/material/icon';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';
import { Barbeiros } from '../../../../../interfaces/barbeiros';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { NgIf } from '@angular/common';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-modal-register-barbeiro',
  templateUrl: './modal-register-barbeiro.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgIf, MatIcon],
  styleUrls: ['./modal-register-barbeiro.component.scss']
})
export class ModalRegisterBarbeiroComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  storage = getStorage();
  private auth = inject(Auth);
  imagePreview: string | ArrayBuffer | null = null;

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
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async addBarberToBarbearia() {
    if (!this.form.valid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.selectedFile) {
      alert('Por favor, selecione uma imagem para o perfil.');
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const barberId = userCredential.user.uid;

      const filePath = `profile/${Date.now()}_${this.selectedFile!.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

      uploadTask.on('state_changed',
        () => { },
        async () => {
          this.downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const barberData: Barbeiros = {
            id: barberId,
            nome: this.form.value.nome,
            rg: this.form.value.rg,
            cpf: this.form.value.cpf,
            telefone: this.form.value.telefone,
            whats: this.form.value.whats,
            email: this.form.value.email,
            password: this.form.value.password,
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

          const barbersCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/barbers`);
          const newBarberDocRef = doc(barbersCollectionRef, barberId);
          await setDoc(newBarberDocRef, barberData);

          const userDocRef = doc(this.firestore, 'users', barberId);
          await setDoc(userDocRef, {
            email: this.form.value.email,
            userType: 'barber',
          });

          const barbeariaRef = doc(this.firestore, `barbearia/${this.data.barbeariaId}`);
          const updatedBarbeariaData = {
            ...(barberData.atendeAutista ? { atendeAutista: true } : {}),
            ...(barberData.atendeCrianca ? { atendeCrianca: true } : {}),
            ...(barberData.atendeDomicilio ? { atendeDomicilio: true } : {}),
            ...(barberData.experienciaCrespo ? { experienciaCrespo: true } : {}),
            ...(barberData.servicoEventos ? { servicoEventos: true } : {}),
          };

          await setDoc(barbeariaRef, updatedBarbeariaData, { merge: true });

          alert('Barbeiro registrado com sucesso e conta de acesso criada!');
          this.dialogRef.close();
        }
      );
    } catch (error: any) {
      return;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
