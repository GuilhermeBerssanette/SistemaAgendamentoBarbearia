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
import {BarbeariasService} from "../../services/barbearias.service";
import {Router} from "@angular/router";
import { Barbearias } from "../../interfaces/barbearias";

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";
import {MatInput} from "@angular/material/input";


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
    MatInput

  ],
  templateUrl: './register-barbearia.component.html',
  styleUrl: './register-barbearia.component.scss'
})
export class RegisterBarbeariaComponent implements OnInit {

  http = inject(HttpClient);
  barbeariasService = inject(BarbeariasService)
  router = inject(Router)

  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'Sinuca', 'TV'];
  estadosList: any[] = [];
  cidadesList: any[] = [];

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

  getIeFormatErrorMessage(): string | null {
    const estado = this.form.controls['estado'].value;

    if (typeof estado === 'string' && this.iePatterns[estado]) {
      const { format } = this.iePatterns[estado];
      return `Formato correto para ${estado}: ${format}`;
    }

    return null;
  }

  cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value;

      if (!cpf) {
        return null;
      }

      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

      if (!cpfRegex.test(cpf)) {
        return { invalidCpfFormat: true };
      }

      const cleanedCpf = cpf.replace(/\D+/g, '');

      if (cleanedCpf.length !== 11) {
        return { invalidCpf: true };
      }

      if (/^(\d)\1+$/.test(cleanedCpf)) {
        return { invalidCpf: true };
      }

      const calculateCheckDigit = (cpf: string, factor: number) => {
        let sum = 0;
        for (let i = 0; i < factor - 1; i++) {
          sum += parseInt(cpf.charAt(i)) * (factor - i);
        }
        const result = (sum * 10) % 11;
        return result === 10 ? 0 : result;
      };

      const firstCheckDigit = calculateCheckDigit(cleanedCpf, 10);
      if (firstCheckDigit !== parseInt(cleanedCpf.charAt(9))) {
        return { invalidCpf: true };
      }

      const secondCheckDigit = calculateCheckDigit(cleanedCpf, 11);
      if (secondCheckDigit !== parseInt(cleanedCpf.charAt(10))) {
        return { invalidCpf: true };
      }

      return null;
    };
  }

  cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cnpj = control.value;

      if (!cnpj) {
        return null;
      }

      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

      if (!cnpjRegex.test(cnpj)) {
        return { invalidCnpjFormat: true };
      }

      const cleanedCnpj = cnpj.replace(/\D+/g, '');

      if (cleanedCnpj.length !== 14) {
        return { invalidCnpj: true };
      }

      if (/^(\d)\1+$/.test(cleanedCnpj)) {
        return { invalidCnpj: true };
      }

      const calculateCheckDigit = (cnpj: string, weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
          sum += parseInt(cnpj.charAt(i)) * weights[i];
        }
        const result = sum % 11;
        return result < 2 ? 0 : 11 - result;
      };

      const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      const firstCheckDigit = calculateCheckDigit(cleanedCnpj, firstWeights);
      if (firstCheckDigit !== parseInt(cleanedCnpj.charAt(12))) {
        return { invalidCnpj: true };
      }

      const secondCheckDigit = calculateCheckDigit(cleanedCnpj, secondWeights);
      if (secondCheckDigit !== parseInt(cleanedCnpj.charAt(13))) {
        return { invalidCnpj: true };
      }

      return null;
    };
  }

  numeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const number = control.value;

      if (!number) {
        return null;
      }

      const numberRegex = /^\d+$/;

      if (!numberRegex.test(number)) {
        return { invalidNumber: true };
      }

      return null;
    };
  }

  contatoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contato = control.value;

      if (!contato) {
        return null;
      }

      const contatoRegex = /^\(\d{2}\)\d{5}-\d{4}$/;

      if (!contatoRegex.test(contato)) {
        return { invalidContato: true };
      }

      return null;
    };
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

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, this.cpfValidator()]),
    cnpj: new FormControl('', [Validators.required, this.cnpjValidator()]),
    inscricaoEstadual: new FormControl('', [Validators.required]),
    nomeFantasia: new FormControl('', [Validators.required]),
    razaoSocial: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    rua: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required, this.numeroValidator()]),
    contato: new FormControl('', [Validators.required, this.contatoValidator()]),
    instagram: new FormControl('', [this.instagramValidator()]),
    facebook: new FormControl('', [this.facebookValidator()]),
    comodidades: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadEstados();
    this.form.controls['estado'].valueChanges.subscribe(() => this.updateIeValidator());
  }

  loadEstados() {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .subscribe(estados => {
        this.estadosList = estados.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  onStateChange(siglaEstado: string) {
    this.cidadesList = [];
    this.form.controls['cidade'].setValue('');

    if (siglaEstado) {
      this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`)
        .subscribe(cidades => {
          this.cidadesList = cidades.sort((a, b) => a.nome.localeCompare(b.nome));
        });
    }
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue()

    if(
      rawForm.name === null ||
      rawForm.cpf === null ||
      rawForm.cnpj === null ||
      rawForm.inscricaoEstadual === null ||
      rawForm.nomeFantasia === null ||
      rawForm.razaoSocial === null ||
      rawForm.estado === null ||
      rawForm.cidade === null ||
      rawForm.rua === null ||
      rawForm.numero === null ||
      rawForm.contato === null ||
      rawForm.instagram === null ||
      rawForm.facebook === null ||
      rawForm.comodidades === null
      ){
      return;
    }

    const barbeariaData: Barbearias = {
      name: rawForm.name,
      cpf: rawForm.cpf,
      cnpj: rawForm.cnpj,
      inscricaoEstadual: rawForm.inscricaoEstadual,
      nomeFantasia: rawForm.nomeFantasia,
      razaoSocial: rawForm.razaoSocial,
      estado: rawForm.estado,
      cidade: rawForm.cidade,
      rua: rawForm.rua,
      numero: rawForm.numero,
      contato: rawForm.contato,
      instagram: rawForm.instagram,
      facebook: rawForm.facebook,
      comodidades: rawForm.comodidades,
    };

    this.barbeariasService.addBarbearia(barbeariaData).then(() => {
      this.router.navigate(['']).then();
    })
      .catch((error) => {
        console.error('Erro ao cadastrar barbearia: ', error);
      });
  }
}
