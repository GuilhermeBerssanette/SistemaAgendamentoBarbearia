import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import { Firestore, doc, getDoc, updateDoc, getDocs, collection } from '@angular/fire/firestore';
import { Barbeiros } from "../../../interfaces/barbeiros";
import { MatDialog } from "@angular/material/dialog";
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { ModalRegisterImageComponent } from "./modals/modal-register-image/modal-register-image.component";
import { ModalRegisterServiceComponent } from "./modals/modal-register-service/modal-register-service.component";
import { MatButton } from "@angular/material/button";
import {ModalEditServiceComponent} from "./modals/modal-edit-service/modal-edit-service.component";


@Component({
  selector: 'app-barber-admin',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatButton,
    KeyValuePipe
  ],
  templateUrl: './barber-admin.component.html',
  styleUrls: ['./barber-admin.component.scss']
})
export class BarberAdminComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);
  barbeiroId!: string;
  barbeiro?: Barbeiros;
  currentSection: string = 'appointments';
  galleryItems: { imageUrl: string, comment: string }[] = [];
  barbers: any[] = [];
  barbeariaId!: string;
  registeredServices: any[] = [];
  form: FormGroup;

  constructor(private dialog: MatDialog) {
    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      rg: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      telefone: new FormControl('', [Validators.required]),
      whats: new FormControl('', [Validators.required]),
      instagram: new FormControl('', [this.instagramValidator()]),
      facebook: new FormControl('', [this.facebookValidator()]),
      tiktok: new FormControl('', [this.tiktokValidator()]),
      twitter: new FormControl('', [this.twitterValidator()]),
    });
    this.loadBarbers();
  }

  async ngOnInit(): Promise<void> {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;

    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado!');
      return;
    }

    this.barbeiroId = this.route.snapshot.paramMap.get('barberId')!;

    if (!this.barbeiroId) {
      console.error('ID do barbeiro não encontrado!');
      return;
    }

    await this.getBarbeiroData(this.barbeiroId);
    await this.getGalleryItems();
    await this.loadRegisteredServices();
    this.populateForm();
  }

  async getBarbeiroData(barbeiroId: string) {
    const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${barbeiroId}`);
    const barbeiroDoc = await getDoc(barbeiroDocRef);

    if (barbeiroDoc.exists()) {
      this.barbeiro = barbeiroDoc.data() as Barbeiros;
    } else {
      console.error('Barbeiro não encontrado!');
    }
  }

  async getGalleryItems() {
    const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}`);
    const barbeiroDoc = await getDoc(barbeiroDocRef);

    if (barbeiroDoc.exists()) {
      const data = barbeiroDoc.data();
      if (data && data['galleryItem']) {
        this.galleryItems = data['galleryItem'];
      }
    }
  }

  async loadRegisteredServices() {
    const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}`);
    const barbeiroDocSnapshot = await getDoc(barbeiroDocRef);

    if (barbeiroDocSnapshot.exists()) {
      const barberData = barbeiroDocSnapshot.data();
      this.registeredServices = barberData?.['services'] || [];
    } else {
      console.error('Documento do barbeiro não encontrado!');
    }
  }

  instagramValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const instagramUrl = control.value;
      if (!instagramUrl) return null;
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
      return !instagramRegex.test(instagramUrl) ? { invalidInstagramUrl: true } : null;
    };
  }

  facebookValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const facebookUrl = control.value;
      if (!facebookUrl) return null;
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;
      return !facebookRegex.test(facebookUrl) ? { invalidFacebookUrl: true } : null;
    };
  }

  tiktokValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tiktokUrl = control.value;
      if (!tiktokUrl) return null;
      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)$/;
      return !tiktokRegex.test(tiktokUrl) ? { invalidTiktokUrl: true } : null;
    };
  }

  twitterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const twitterUrl = control.value;
      if (!twitterUrl) return null;
      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
      return !twitterRegex.test(twitterUrl) ? { invalidTwitterUrl: true } : null;
    };
  }

  populateForm() {
    if (this.barbeiro) {
      this.form.patchValue({
        nome: this.barbeiro.nome,
        rg: this.barbeiro.rg,
        cpf: this.barbeiro.cpf,
        email: this.barbeiro.email,
        telefone: this.barbeiro.telefone,
        whats: this.barbeiro.whats,
        instagram: this.barbeiro.instagram,
        facebook: this.barbeiro.facebook,
        tiktok: this.barbeiro.tiktok,
        twitter: this.barbeiro.twitter,
      });
    }
  }

  async updateProfile() {
    if (this.barbeiro) {
      const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}`);
      try {
        await updateDoc(barbeiroDocRef, this.form.value);
        alert('Perfil atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar o perfil:', error);
      }
    }
  }

  loadBarbers() {
    const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
    getDocs(collection(barbeariaDocRef, 'barbers')).then(snapshot => {
      this.barbers = snapshot.docs.map(doc => doc.data());
    });
  }

  openModalRegisterImage() {
    this.dialog.open(ModalRegisterImageComponent, {
      data: { barberId: this.barbeiroId },
      width: '400px',
      height: '300px',
    });
  }

  openModalRegisterService(): void {
    this.dialog.open(ModalRegisterServiceComponent, {
      data: { barberId: this.barbeiroId, barbeariaId: this.barbeariaId },
      width: '400px',
      height: '300px',
    });
  }

  openModalEditService(): void {
    this.dialog.open(ModalEditServiceComponent, {
      data: { barberId: this.barbeiroId, barbeariaId: this.barbeariaId },
      width: '400px',
      height: '300px',
    });
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

}