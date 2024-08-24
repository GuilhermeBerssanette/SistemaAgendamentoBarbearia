import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {BarbeariasService} from "../../services/barbearias.service";
import {Router} from "@angular/router";
import { Barbearias } from "../../interfaces/barbearias";

@Component({
  selector: 'app-register-barbearia',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './register-barbearia.component.html',
  styleUrl: './register-barbearia.component.scss'
})
export class RegisterBarbeariaComponent {

  http = inject(HttpClient);
  barbeariasService = inject(BarbeariasService)
  router = inject(Router)

  form = new FormGroup({
    contato: new FormControl(''),
    cpf: new FormControl(''),
    endereco: new FormControl(''),
    inscricaoEstadual: new FormControl(''),
    nomeFantasia: new FormControl(''),
    razaoSocial: new FormControl(''),
  });


  onSubmit(): void {
    const rawForm = this.form.getRawValue()

    if(
      rawForm.contato === null ||
      rawForm.cpf === null ||
      rawForm.endereco === null ||
      rawForm.inscricaoEstadual === null ||
      rawForm.nomeFantasia === null ||
      rawForm.razaoSocial === null){
      return;
    }

    const barbeariaData: Barbearias = {
      contato: rawForm.contato,
      cpf: rawForm.cpf,
      endereco: rawForm.endereco,
      inscricaoEstadual: rawForm.inscricaoEstadual,
      nomeFantasia: rawForm.nomeFantasia,
      razaoSocial: rawForm.razaoSocial
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



