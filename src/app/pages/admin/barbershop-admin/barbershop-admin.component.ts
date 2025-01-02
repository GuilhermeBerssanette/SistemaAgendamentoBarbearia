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
import { Firestore, doc, updateDoc, collection, getDocs, addDoc, deleteDoc } from "@angular/fire/firestore";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { HeaderAdminComponent } from "../../../components/header-admin/header-admin.component";
import { Timestamp } from 'firebase/firestore';
import { MatIcon } from '@angular/material/icon';
import { DashboardComponent } from "../../../components/dashboard/dashboard.component";

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
    HeaderAdminComponent,
    MatIcon,
    DashboardComponent
  ],
  templateUrl: './barbershop-admin.component.html',
  styleUrls: ['./barbershop-admin.component.scss']
})
export class BarbershopAdminComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);

  barbeariaId!: string;
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'Sinuca', 'TV'];
  barbeiros: any[] = [];
  storage = getStorage();
  selectedSection: string = 'dashboard';
  click: any;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadBarbeiros();
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
      numero: new FormControl(''),
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

  async loadBarbeiros(): Promise<void> {
    try {
      const barbersCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const querySnapshot = await getDocs(barbersCollectionRef);
      this.barbeiros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      alert('Não foi possível carregar os barbeiros.');
    }
  }

  confirmDeleteBarbeiro(barbeiro: any) {
    const confirmed = confirm(`Tem certeza que deseja excluir o barbeiro ${barbeiro.nome}?`);
    if (confirmed) {
      this.deleteBarbeiro(barbeiro);
    }
  }

  async deleteBarbeiro(barbeiro: any): Promise<void> {
    try {
      const excludeCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/exclude`);
      await addDoc(excludeCollectionRef, {
        nome: barbeiro.nome,
        cpf: barbeiro.cpf,
        dataExclusao: Timestamp.now()
      });
      const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${barbeiro.id}`);
      await deleteDoc(barbeiroDocRef);
      this.barbeiros = this.barbeiros.filter(b => b.id !== barbeiro.id);
      alert('Barbeiro excluído com sucesso!');
    } catch (error) {
      alert('Não foi possível excluir o barbeiro.');
    }
  }

  showSection(section: string) {
    this.selectedSection = section;
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
        async () => {
          updatedData.profileImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
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
      alert('Não foi possível atualizar o perfil.');
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

  openModalRegisterBarber() {
    const dialogRef = this.dialog.open(ModalRegisterBarbeiroComponent, {
      data: { barbeariaId: this.barbeariaId },
      width: '400px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBarbeiros();
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }
}
