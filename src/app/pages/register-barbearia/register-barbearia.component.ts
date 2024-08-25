import {Component, inject} from '@angular/core';
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
    NgForOf

  ],
  templateUrl: './register-barbearia.component.html',
  styleUrl: './register-barbearia.component.scss'
})
export class RegisterBarbeariaComponent {

  http = inject(HttpClient);
  barbeariasService = inject(BarbeariasService)
  router = inject(Router)

  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'Sinuca', 'TV'];

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

      // Expressão regular para validar o formato xx.xxx.xxx/xxxx-xx
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

      if (!cnpjRegex.test(cnpj)) {
        return { invalidCnpjFormat: true };
      }

      // Remove caracteres não numéricos
      const cleanedCnpj = cnpj.replace(/\D+/g, '');

      // Verifica se o CNPJ tem 14 dígitos
      if (cleanedCnpj.length !== 14) {
        return { invalidCnpj: true };
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cleanedCnpj)) {
        return { invalidCnpj: true };
      }

      // Função para calcular o dígito verificador
      const calculateCheckDigit = (cnpj: string, weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
          sum += parseInt(cnpj.charAt(i)) * weights[i];
        }
        const result = sum % 11;
        return result < 2 ? 0 : 11 - result;
      };

      // Pesos para o cálculo dos dígitos verificadores
      const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      // Verifica o primeiro dígito verificador
      const firstCheckDigit = calculateCheckDigit(cleanedCnpj, firstWeights);
      if (firstCheckDigit !== parseInt(cleanedCnpj.charAt(12))) {
        return { invalidCnpj: true };
      }

      // Verifica o segundo dígito verificador
      const secondCheckDigit = calculateCheckDigit(cleanedCnpj, secondWeights);
      if (secondCheckDigit !== parseInt(cleanedCnpj.charAt(13))) {
        return { invalidCnpj: true };
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

      // Expressão regular para validar o formato (xx)xxxxx-xxxx
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
    estado: new FormControl(''),
    cidade: new FormControl(''),
    rua: new FormControl(''),
    numero: new FormControl(''),
    contato: new FormControl('', [Validators.required, this.contatoValidator()]),
    instagram: new FormControl('', [this.instagramValidator()]),
    facebook: new FormControl('', [this.facebookValidator()]),
    comodidades: new FormControl(''),
  });



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
      // console.log('Barbearia cadastrada com sucesso!');
      this.router.navigate(['']).then();
    })
      .catch((error) => {
        console.error('Erro ao cadastrar barbearia: ', error);
      });
  }
}



