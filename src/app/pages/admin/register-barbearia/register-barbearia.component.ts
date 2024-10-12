import {Component, inject, OnInit} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {BarbeariasService} from "../../../services/barbearias.service";
import {Router} from "@angular/router";
import { Barbearias } from "../../../interfaces/barbearias";

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";
import {MatInput} from "@angular/material/input";

import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';

import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {uploadBytesResumable} from "@angular/fire/storage";


@Component({
  selector: 'app-register-barbearia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    NgForOf,
    MatInput,
    NgxMaskDirective,
    NgxMaskPipe,

  ],
  templateUrl: './register-barbearia.component.html',
  styleUrl: './register-barbearia.component.scss'
})
export class RegisterBarbeariaComponent implements OnInit {

  http = inject(HttpClient);
  barbeariasService = inject(BarbeariasService)
  router = inject(Router)
  storage = getStorage();

  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'Sinuca', 'TV'];
  estadosList: any[] = [];
  cidadesList: any[] = [];

  isPJ = false;
  isPF = false;


  selectedFile: File | null = null;
  downloadURL: string | null = null;

  iePatterns: { [key: string]: { pattern: RegExp, format: string } } = {
    'AC': { pattern: /^\d{13}$/, format: 'xxx.xxx.xxx.xxx' },
    'DF': { pattern: /^\d{13}$/, format: 'xxx.xxx.xxx.xxx' },
    'MG': { pattern: /^\d{13}$/, format: 'xxx.xxx.xxx.xxx' },
    'AL': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'AP': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'AM': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'CE': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'MA': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'PA': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'PB': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'RR': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'SC': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'SE': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'TO': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'ES': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'GO': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'PE': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'PI': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'RN': { pattern: /^\d{9}$/, format: 'xxx.xxx.xxx' },
    'BA': { pattern: /^\d{8}$/, format: 'xxxxxxx' },
    'PR': { pattern: /^\d{8}$/, format: 'xxxxxxx' },
    'RJ': { pattern: /^\d{8}$/, format: 'xxxxxxx' },
    'MS': { pattern: /^\d{10}$/, format: 'xxxxxxxxxx' },
    'RS': { pattern: /^\d{10}$/, format: 'xxxxxxxxxx' },
    'MT': { pattern: /^\d{11}$/, format: 'xxxxxxxxxxx' },
    'SP': { pattern: /^\d{12}$/, format: 'xxxxxxxxxxxx' },
    'RO': { pattern: /^\d{14}$/, format: 'xxxxxxxxxxxxxx' }
  };

  createIeValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ie = control.value;

      if (!ie) {
        return null;
      }

      if (!regex.test(ie)) {
        return { invalidIeFormat: true };
      }

      return null;
    };
  }

  updateIeValidator() {
    const estado = this.form.controls['estado'].value;

    if (typeof estado === 'string' && estado in this.iePatterns) {
      const { pattern } = this.iePatterns[estado];
      const ieValidator = this.createIeValidator(pattern);
      this.form.controls['inscricaoEstadual'].setValidators([Validators.required, ieValidator]);
    } else {
      this.form.controls['inscricaoEstadual'].setValidators([Validators.required]);
    }

    this.form.controls['inscricaoEstadual'].updateValueAndValidity();
  }

  instagramValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const instagramUrl = control.value;

      if (!instagramUrl) {
        return null;
      }

      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;

      if (!instagramRegex.test(instagramUrl)) {
        return { invalidInstagramUrl: true };
      }

      return null;
    };
  }

  facebookValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const facebookUrl = control.value;

      if (!facebookUrl) {
        return null;
      }
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;

      if (!facebookRegex.test(facebookUrl)) {
        return { invalidFacebookUrl: true };
      }
      return null;
    };
  }

  tiktokValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tiktokUrl = control.value;

      if (!tiktokUrl) {
        return null;
      }

      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)$/;

      if (!tiktokRegex.test(tiktokUrl)) {
        return { invalidTiktokUrl: true };
      }

      return null;
    };
  }

  twitterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const twitterUrl = control.value;

      if (!twitterUrl) {
        return null;
      }

      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;

      if (!twitterRegex.test(twitterUrl)) {
        return { invalidTwitterUrl: true };
      }

      return null;
    };
  }

  onTipoPessoaChange(tipo: string): void {
    this.isPJ = tipo === 'PJ';
    this.isPF = tipo === 'PF';

    if (tipo === 'PJ') {
      this.form.get('cnpj')?.setValidators([Validators.required]);
      this.form.get('inscricaoEstadual')?.setValidators([Validators.required]);
      this.form.get('cpf')?.clearValidators();
      this.form.get('rg')?.clearValidators();
    } else if (tipo === 'PF') {
      this.form.get('cpf')?.setValidators([Validators.required]);
      this.form.get('rg')?.setValidators([Validators.required]);
      this.form.get('cnpj')?.clearValidators();
      this.form.get('inscricaoEstadual')?.clearValidators();
    }

    this.form.get('cnpj')?.updateValueAndValidity();
    this.form.get('inscricaoEstadual')?.updateValueAndValidity();
    this.form.get('cpf')?.updateValueAndValidity();
    this.form.get('rg')?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.loadEstados();
    this.form.controls['estado'].valueChanges.subscribe(() => this.updateIeValidator());

    this.form.get('tipoPessoa')?.valueChanges.subscribe(value => {
      if (value === 'PJ') {
        this.isPJ = true;
        this.isPF = false;
        this.form.get('cnpj')?.setValidators([Validators.required]);
        this.form.get('cpf')?.clearValidators();
        this.form.get('inscricaoEstadual')?.setValidators([Validators.required]);
        this.form.get('rg')?.clearValidators();
      } else if (value === 'PF') {
        this.isPJ = false;
        this.isPF = true;
        this.form.get('cpf')?.setValidators([Validators.required]);
        this.form.get('cnpj')?.clearValidators();
        this.form.get('inscricaoEstadual')?.clearValidators();
        this.form.get('rg')?.setValidators([Validators.required]);
      } else {
        this.isPJ = false;
        this.isPF = false;
        this.form.get('cpf')?.clearValidators();
        this.form.get('cnpj')?.clearValidators();
        this.form.get('inscricaoEstadual')?.clearValidators();
        this.form.get('rg')?.clearValidators();
      }
      this.form.get('cpf')?.updateValueAndValidity();
      this.form.get('cnpj')?.updateValueAndValidity();
      this.form.get('inscricaoEstadual')?.updateValueAndValidity();
      this.form.get('rg')?.updateValueAndValidity();
    });
  }

  loadEstados() {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .subscribe(estados => {
        this.estadosList = estados.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  onStateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const siglaEstado = target.value;
    this.cidadesList = [];
    this.form.controls['cidade'].setValue('');

    if (siglaEstado) {
      this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`)
        .subscribe(cidades => {
          this.cidadesList = cidades.sort((a, b) => a.nome.localeCompare(b.nome));
        });
    }
  }

  form = new FormGroup({
    tipoPessoa: new FormControl('', [Validators.required]),
    cnpj: new FormControl('', []),
    inscricaoEstadual: new FormControl('', []),
    cpf: new FormControl('', []),
    rg: new FormControl('', []),
    nomeFantasia: new FormControl('', [Validators.required]),
    razaoSocial: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    rua: new FormControl('', [Validators.required]),
    numero: new FormControl('', []),
    celular: new FormControl('', [Validators.required]),
    whats: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required ,Validators.email]),
    tiktok: new FormControl('', [this.tiktokValidator()]),
    twitter: new FormControl('', [this.twitterValidator()]),
    instagram: new FormControl('', [this.instagramValidator()]),
    facebook: new FormControl('', [this.facebookValidator()]),
    comodidades: new FormControl(''),
    responsavel: new FormControl('', [Validators.required]),
    profileImage: new FormControl('', [Validators.required])
  });

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  onSubmit(): void {
    const rawForm = this.form.getRawValue()

    if (!this.selectedFile) {
      console.error('Imagem de perfil não selecionada.');
      return;
    }

    if (
      rawForm.nomeFantasia === null ||
      rawForm.razaoSocial === null ||
      rawForm.responsavel === null ||

      rawForm.rg === null ||
      rawForm.cpf === null ||
      rawForm.cnpj === null ||
      rawForm.inscricaoEstadual === null ||

      rawForm.estado === null ||
      rawForm.cidade === null ||
      rawForm.rua === null ||
      rawForm.numero === null ||

      rawForm.email === null ||
      rawForm.celular === null ||
      rawForm.whats === null ||
      rawForm.telefone === null ||


      rawForm.instagram === null ||
      rawForm.facebook === null ||

      rawForm.tiktok === null ||
      rawForm.twitter === null ||

      rawForm.comodidades === null ||

      rawForm.profileImage === null

    ) {
      return;
    }

    const barbeariaData: Barbearias = {
      nomeFantasia: rawForm.nomeFantasia,
      razaoSocial: rawForm.razaoSocial,
      responsavel: rawForm.responsavel,

      rg: rawForm.rg,
      cpf: rawForm.cpf,
      cnpj: rawForm.cnpj,
      inscricaoEstadual: rawForm.inscricaoEstadual,

      estado: rawForm.estado,
      cidade: rawForm.cidade,
      rua: rawForm.rua,
      numero: rawForm.numero,

      email: rawForm.email,
      celular: rawForm.celular,
      whats: rawForm.whats,
      telefone: rawForm.telefone,

      instagram: rawForm.instagram,
      facebook: rawForm.facebook,
      tiktok: rawForm.tiktok,
      twitter: rawForm.twitter,

      comodidades: rawForm.comodidades,

      profileImageUrl: rawForm.profileImage,
    };

    const filePath = `profile/${Date.now()}_${this.selectedFile!.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

    uploadTask.on('state_changed',
      () => { },
      (error) => {
        console.error('Erro ao fazer upload da imagem:', error);
      },
      () => {
        // Obtendo a URL de download após o upload ser concluído
        getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
          this.downloadURL = url;
          // Salvando a URL da imagem e os dados da barbearia no Firestore
          barbeariaData.profileImageUrl = url;

          this.barbeariasService.addBarbearia(barbeariaData).then(() => {
            this.router.navigate(['']).then(() => {
              console.log('Cadastro da barbearia concluído com sucesso.');
            });
          }).catch((error) => {
            console.error('Erro ao cadastrar barbearia:', error);
          });
        });
      }
    );
  }
}

