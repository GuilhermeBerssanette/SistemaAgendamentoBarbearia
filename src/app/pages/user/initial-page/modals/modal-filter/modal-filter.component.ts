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
      tiposAtendimento: this.fb.array(this.tiposAtendimento.map(() => new FormControl(false))),
      valorMaximo: ['']
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

    const selectedComodidades = this.filterForm.get('comodidades')!.value
      .map((isSelected: boolean, index: number) => isSelected ? this.comodidades[index] : null)
      .filter((comodidade: string | null) => comodidade !== null);

    const selectedTiposAtendimento = this.filterForm.get('tiposAtendimento')!.value
      .map((isSelected: boolean, index: number) => isSelected ? this.tiposAtendimento[index] : null)
      .filter((tipo: string | null) => tipo !== null);

    const filtrosSelecionados = {
      estado: filtro.estado || null,
      cidade: filtro.cidade || null,
      comodidades: selectedComodidades,
      tiposAtendimento: selectedTiposAtendimento,
      valorMaximo: filtro.valorMaximo || null,
    };

    this.dialogRef.close(filtrosSelecionados);
  }

  closeModalFilter() {
    this.dialogRef.close();
  }
}
