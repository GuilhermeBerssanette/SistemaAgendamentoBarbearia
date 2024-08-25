import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from "@angular/forms";
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
    MatFormFieldModule, // Import the MatFormFieldModule
    MatSelectModule, // Import the MatSelectModule
    MatOptionModule, // Import the MatOptionModule
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

  comodidadesList: string[] = ['Ar-Condicionado', 'Wi-fi', 'não sei o que', 'não sei o que lá'];

  form = new FormGroup({
    name: new FormControl(''),
    cpf: new FormControl(''),
    cnpj: new FormControl(''),
    inscricaoEstadual: new FormControl(''),
    nomeFantasia: new FormControl(''),
    razaoSocial: new FormControl(''),
    estado: new FormControl(''),
    cidade: new FormControl(''),
    rua: new FormControl(''),
    numero: new FormControl(''),
    contato: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
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

      // this.router.navigate(['/login']).then();


}



