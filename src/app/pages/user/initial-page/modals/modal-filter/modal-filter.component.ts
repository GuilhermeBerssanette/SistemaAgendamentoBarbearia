import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from "@angular/material/icon";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./modal-filter.component.scss']
})
export class ModalFilterComponent implements OnInit {
  filterForm!: FormGroup;
  estadosList: any[] = [];
  cidadesList: any[] = [];

  comodidades: string[] = ['Sinuca', 'TV', 'Wi-Fi', 'Ar-condicionado'];
  tiposAtendimento: string[] = ['Atende Autista', 'Cabelo Crespo', 'Atende Domicílio', 'Atende Eventos'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFilterComponent>,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      estado: [''],
      cidade: [{ value: '', disabled: true }],
      comodidades: this.fb.array(this.comodidades.map(() => new FormControl(false))),
      tiposAtendimento: this.fb.array(this.tiposAtendimento.map(() => new FormControl(false)))
    });

    this.loadEstados();

    this.filterForm.get('estado')?.valueChanges.subscribe(siglaEstado => {
      if (siglaEstado) {
        this.loadCidades(siglaEstado);
        this.filterForm.get('cidade')?.enable();
      } else {
        this.filterForm.get('cidade')?.disable();
        this.filterForm.get('cidade')?.reset();
        this.cidadesList = [];
      }
    });
  }

  loadEstados(): void {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .subscribe(estados => {
        this.estadosList = estados.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  loadCidades(siglaEstado: string): void {
    this.http.get<any[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`)
      .subscribe(cidades => {
        this.cidadesList = cidades.sort((a, b) => a.nome.localeCompare(b.nome));
      });
  }

  getComodidadeControl(index: number): FormControl {
    return (this.filterForm.get('comodidades') as any).at(index) as FormControl;
  }

  getTipoAtendimentoControl(index: number): FormControl {
    return (this.filterForm.get('tiposAtendimento') as any).at(index) as FormControl;
  }

  aplicarFiltro() {
    const filtro = this.filterForm.value;

    const selectedComodidades = this.filterForm.value.comodidades
      .map((checked: boolean, index: number) => checked ? this.comodidades[index] : null)
      .filter((item: string | null) => item);

    const selectedTiposAtendimento = this.filterForm.value.tiposAtendimento
      .map((checked: boolean, index: number) => checked ? this.tiposAtendimento[index] : null)
      .filter((item: string | null) => item);

    const filtrosSelecionados = {
      estado: filtro.estado,
      cidade: filtro.cidade,
      comodidades: selectedComodidades,
      tiposAtendimento: selectedTiposAtendimento
    };

    this.dialogRef.close(filtrosSelecionados);
  }

  closeModalFilter() {
    this.dialogRef.close();
  }
}
