import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {DatePipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {Firestore, doc, getDoc, updateDoc, getDocs, collection, deleteDoc} from '@angular/fire/firestore';
import { Barbeiros } from "../../../interfaces/barbeiros";
import { MatDialog } from "@angular/material/dialog";
import {FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule} from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { ModalRegisterImageComponent } from "./modals/modal-register-image/modal-register-image.component";
import { ModalRegisterServiceComponent } from "./modals/modal-register-service/modal-register-service.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import { ModalEditServiceComponent } from "./modals/modal-edit-service/modal-edit-service.component";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { deleteObject, getMetadata, listAll } from "@angular/fire/storage";
import {ModalRegisterComboComponent} from "./modals/modal-register-combo/modal-register-combo.component";
import {ModalEditComboComponent} from "./modals/modal-edit-combo/modal-edit-combo.component";
import { HeaderComponent } from '../../../components/header/header.component';
import {HeaderBarbersAdminComponent} from "../../../components/header-barbers-admin/header-barbers-admin.component";
import { MatIcon } from '@angular/material/icon';
import {GoogleCalendarService} from "../../../services/google-calendar.service";
import {DashboardComponent} from "../../../components/dashboard/dashboard.component";
import {ModalManageScheduleComponent} from "./modals/modal-manage-schedule/modal-manage-schedule.component";

@Component({
  selector: 'app-barber-admin',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatButton,
    KeyValuePipe,
    HeaderComponent,
    HeaderBarbersAdminComponent,
    MatIcon,
    MatIconButton,
    DatePipe,
    DashboardComponent
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
  galleryItems: { imageUrl: string, comment: string, filePath: string }[] = [];
  barbeariaId!: string;
  registeredServices: any[] = [];
  registeredCombos: any[] = [];
  form: FormGroup;
  storage = getStorage();
  selectedSection: string = 'dashboard';
  appointments: any[] = [];
  calendarService = inject(GoogleCalendarService);

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
      twitter: new FormControl('', [this.twitterValidator()])
    });
  }

  async ngOnInit(): Promise<void> {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.barbeiroId = this.route.snapshot.paramMap.get('barberId')!;

    if (!this.barbeariaId || !this.barbeiroId) {
      return;
    }

    try {
      await this.calendarService.initGoogleAPI();
      await this.calendarService.ensureBarberAuthenticated(this.barbeariaId, this.barbeiroId);
      await this.getBarbeiroData();
      await this.getGalleryItems();
      await this.loadRegisteredServices();
      await this.loadRegisteredCombos();
      await this.getAppointments();
      this.populateForm();
    } catch (error) {
      return;
    }
  }

  async getAppointments() {
    const appointmentsCollectionRef = collection(
      this.firestore,
      `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}/appointments`
    );
    const appointmentsSnapshot = await getDocs(appointmentsCollectionRef);

    this.appointments = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        client: data['client'],
        start: data['start'],
        end: data['end'],
        googleEventId: data['googleEventId'],
        serviceOrCombo: data['serviceOrCombo'],
        type: data['type'],
      };
    });
  }

  async getBarbeiroData() {
    const barbeiroDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}`);
    const barbeiroDoc = await getDoc(barbeiroDocRef);

    if (barbeiroDoc.exists()) {
      this.barbeiro = barbeiroDoc.data() as Barbeiros;
    } else {
      return;
    }
  }

  async getGalleryItems() {
    const galleryRef = ref(this.storage, `gallery/${this.barbeiroId}`);
    const gallerySnapshot = await listAll(galleryRef);

    this.galleryItems = await Promise.all(
      gallerySnapshot.items.map(async (item) => {
        const imageUrl = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        const comment = metadata.customMetadata?.['comment'] || 'Sem comentário';
        const filePath = item.fullPath;
        return { imageUrl, comment, filePath };
      })
    );
  }

  async loadRegisteredServices() {
    const servicesCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}/services`);
    const servicesSnapshot = await getDocs(servicesCollectionRef);

    this.registeredServices = servicesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        price: data['price'],
        duration: data['duration']
      };
    });
  }

  async loadRegisteredCombos() {
    const combosCollectionRef = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}/combos`);
    const combosSnapshot = await getDocs(combosCollectionRef);

    this.registeredCombos = combosSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        price: data['price'],
        duration: data['duration'],
        services: data['services']
      };
    });
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
        return;
      }
    }
  }

  openModalRegisterImage() {
    const dialogRef = this.dialog.open(ModalRegisterImageComponent, {
      data: { barberId: this.barbeiroId },
      width: '500px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getGalleryItems();
      }
    });
  }

  deleteImage(item: { imageUrl: string, comment: string, filePath: string }) {
    if (confirm('Você tem certeza que deseja excluir esta postagem?')) {
      const storageRef = ref(this.storage, item.filePath);
      deleteObject(storageRef).then(() => {
        this.galleryItems = this.galleryItems.filter(galleryItem => galleryItem.filePath !== item.filePath);
      })
    }
  }

  openModalRegisterService(): void {
    const dialogRef = this.dialog.open(ModalRegisterServiceComponent, {
      data: { barberId: this.barbeiroId, barbeariaId: this.barbeariaId },
      width: '400px',
      height: '545px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRegisteredServices();
      }
    });
  }


  openModalRegisterCombo(): void {
    this.dialog.open(ModalRegisterComboComponent, {
      data: { barberId: this.barbeiroId, barbeariaId: this.barbeariaId },
      width: '400px',
      height: '545px',
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadRegisteredCombos();
      }
    });
  }

  openModalEditService(service: any): void {
    const dialogRef = this.dialog.open(ModalEditServiceComponent, {
      data: {
        barberId: this.barbeiroId,
        barbeariaId: this.barbeariaId,
        service: service
      },
      width: '400px',
      height: '510px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRegisteredServices();
      }
    });
  }

  openModalEditCombo(combo: any): void {
    const dialogRef = this.dialog.open(ModalEditComboComponent, {
      data: {
        barberId: this.barbeiroId,
        barbeariaId: this.barbeariaId,
        combo: combo
      },
      width: '400px',
      height: '570px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRegisteredCombos();
      }
    });
  }

  async deleteService(serviceId: string): Promise<void> {
    const confirmDelete = confirm('Tem certeza que deseja excluir este serviço?');

    if (confirmDelete) {
      try {
        const serviceDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}/services/${serviceId}`);
        await deleteDoc(serviceDocRef);
        alert('Serviço excluído com sucesso.');
        await this.loadRegisteredServices();
      } catch (error) {
        return;
      }
    }
  }

  async deleteCombo(comboId: string): Promise<void> {
    const confirmDelete = confirm('Tem certeza que deseja excluir este combo?');

    if (confirmDelete) {
      try {
        const comboDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barbeiroId}/combos/${comboId}`);
        await deleteDoc(comboDocRef);
        alert('Combo excluído com sucesso.');
        await this.loadRegisteredCombos();
      } catch (error) {
        return;
      }
    }
  }

  openModalManageSchedule() {
    this.dialog.open(ModalManageScheduleComponent, {
      width: '600px',
      data: { barberId: this.barbeiroId, barbeariaId: this.barbeariaId },
    });
  }

  showSection(section: string) {
    this.selectedSection = section;
  }

  isAdmin(): boolean {
    return this.router.url.includes('/admin');
  }
}
