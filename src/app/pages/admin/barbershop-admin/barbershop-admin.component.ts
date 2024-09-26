import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ModalRegisterBarbeiroComponent} from "./modals/modal-register-barbeiro/modal-register-barbeiro.component";

@Component({
  selector: 'app-barbershop-admin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgxMaskDirective,
    MatDialogModule
  ],
  templateUrl: './barbershop-admin.component.html',
  styleUrls: ['./barbershop-admin.component.scss']
})
export class BarbershopAdminComponent implements OnInit{

  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor(public dialog: MatDialog) {}


  barbeariaId!: string;

    ngOnInit(): void {
      this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
      if (!this.barbeariaId) {
    }
  }

  openModalRegisterBarber() {
    this.dialog.open(ModalRegisterBarbeiroComponent, {
      data: { id: this.barbeariaId },
      width: '1000px',
      height: '510px',
    });
  }
}