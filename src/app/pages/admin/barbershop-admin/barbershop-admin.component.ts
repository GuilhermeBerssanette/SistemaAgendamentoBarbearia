import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ModalRegisterBarbeiroComponent } from "./modals/modal-register-barbeiro/modal-register-barbeiro.component";
import { HeaderComponent } from '../../../components/header/header.component';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {Firestore, doc, getDoc, updateDoc, collection, getDocs} from "@angular/fire/firestore";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-barbershop-admin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgxMaskDirective,
    MatDialogModule,
    HeaderComponent,
    NgForOf,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './barbershop-admin.component.html',
  styleUrls: ['./barbershop-admin.component.scss']
})
export class BarbershopAdminComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);

  currentSection: string = 'finance';
  barbeariaId!: string;
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'Sinuca', 'TV'];
  barbeiros: any[] = [];
  storage = getStorage();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado!');
    } else {
      this.initForm();
      this.loadBarbeariaData();
      this.loadBarbeiros();
    }
  }

  initForm() {
    this.profileForm = new FormGroup({
      nomeFantasia: new FormControl('', [Validators.required]),
      razaoSocial: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      whats: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required]),
      rua: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      cnpj: new FormControl('', [Validators.required]),
      inscricaoEstadual: new FormControl('', [Validators.required]),
      instagram: new FormControl('', [this.instagramValidator()]),
      facebook: new FormControl('', [this.facebookValidator()]),
      tiktok: new FormControl('', [this.tiktokValidator()]),
      twitter: new FormControl('', [this.twitterValidator()]),
      profileImageUrl: new FormControl(''),
      comodidades: new FormControl([], [Validators.required]),
    });
  }

  async loadBarbeariaData(): Promise<void> {
    const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
    const barbeariaDoc = await getDoc(barbeariaDocRef);

    if (barbeariaDoc.exists()) {
      this.profileForm.patchValue(barbeariaDoc.data());
    } else {
      console.error('Barbearia não encontrada!');
    }
  }

  instagramValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const instagramUrl = control.value;
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
      return instagramUrl && !instagramRegex.test(instagramUrl) ? { invalidInstagramUrl: true } : null;
    };
  }

  facebookValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const facebookUrl = control.value;
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;
      return facebookUrl && !facebookRegex.test(facebookUrl) ? { invalidFacebookUrl: true } : null;
    };
  }

  tiktokValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const tiktokUrl = control.value;
      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)$/;
      return tiktokUrl && !tiktokRegex.test(tiktokUrl) ? { invalidTiktokUrl: true } : null;
    };
  }

  twitterValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const twitterUrl = control.value;
      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
      return twitterUrl && !twitterRegex.test(twitterUrl) ? { invalidTwitterUrl: true } : null;
    };
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }

    const updatedData = this.profileForm.value;

    if (this.selectedFile) {
      const filePath = `profile/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

      uploadTask.on('state_changed', () => { },
        (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          updatedData.profileImageUrl = url;
          await this.updateBarbeariaData(updatedData);
        });
    } else {
      await this.updateBarbeariaData(updatedData);
    }
  }

  async updateBarbeariaData(data: any): Promise<void> {
    try {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
      await updateDoc(barbeariaDocRef, data);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar os dados da barbearia:', error);
    }
  }

  openModalRegisterBarber() {
    this.dialog.open(ModalRegisterBarbeiroComponent, {
      data: { barbeariaId: this.barbeariaId },
      width: '300px',
      height: '300px',
    });
  }

  async loadBarbeiros(): Promise<void> {
    try {
      const barbeirosCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const barbeirosSnapshot = await getDocs(barbeirosCollectionRef);

      this.barbeiros = barbeirosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao carregar os barbeiros:', error);
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
  }
}
