import {Component, Inject, inject, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BarbeariasService } from "../../../../services/barbearias.service";
import { Router } from "@angular/router";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
  ReactiveFormsModule
} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxMaskDirective} from "ngx-mask";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-modal-register-barbeiro',
  standalone: true,
  templateUrl: './modal-register-barbeiro.component.html',
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective,
    NgIf
  ],
  styleUrls: ['./modal-register-barbeiro.component.scss'] // Corrigido de styleUrl para styleUrls
})
export class ModalRegisterBarbeiroComponent implements OnInit {

  http = inject(HttpClient);
  barbeariasService = inject(BarbeariasService);
  router = inject(Router);


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<ModalRegisterBarbeiroComponent>
  ) {}



  // Validações de URLs de redes sociais
  instagramValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const instagramUrl = control.value;
      if (!instagramUrl) return null;
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
      return !instagramRegex.test(instagramUrl) ? {invalidInstagramUrl: true} : null;
    };
  }

  facebookValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const facebookUrl = control.value;
      if (!facebookUrl) return null;
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;
      return !facebookRegex.test(facebookUrl) ? {invalidFacebookUrl: true} : null;
    };
  }

  tiktokValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tiktokUrl = control.value;
      if (!tiktokUrl) return null;
      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)$/;
      return !tiktokRegex.test(tiktokUrl) ? {invalidTiktokUrl: true} : null;
    };
  }

  twitterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const twitterUrl = control.value;
      if (!twitterUrl) return null;
      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
      return !twitterRegex.test(twitterUrl) ? {invalidTwitterUrl: true} : null;
    };
  }

  // Formulário com validações
  form = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    rg: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    whats: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tiktok: new FormControl('', [this.tiktokValidator()]),
    twitter: new FormControl('', [this.twitterValidator()]),
    instagram: new FormControl('', [this.instagramValidator()]),
    facebook: new FormControl('', [this.facebookValidator()]),
  });

  barbeariaId!: string;

  ngOnInit(): void {
    this.barbeariaId = this.data.id;

    if (!this.barbeariaId) {
      console.error('ID da barbearia não encontrado');
      return;
    }
  }


  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    // Garantir que nenhum valor seja null ao invés de string
    const barberData = {
      nome: this.form.get('nome')?.value ?? '',
      rg: this.form.get('rg')?.value ?? '',
      cpf: this.form.get('cpf')?.value ?? '',
      telefone: this.form.get('telefone')?.value ?? '',
      whats: this.form.get('whats')?.value ?? '',
      email: this.form.get('email')?.value ?? '',
      tiktok: this.form.get('tiktok')?.value ?? '',
      twitter: this.form.get('twitter')?.value ?? '',
      instagram: this.form.get('instagram')?.value ?? '',
      facebook: this.form.get('facebook')?.value ?? ''
    };

    this.barbeariasService.addBarberToBarbearia(this.barbeariaId, barberData)
      .then(() => {
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error('Erro ao cadastrar barbeiro: ', error);
      });
  }

}
