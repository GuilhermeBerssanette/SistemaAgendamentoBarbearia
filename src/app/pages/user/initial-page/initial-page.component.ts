import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ModalFilterComponent } from './modals/modal-filter/modal-filter.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./initial-page.component.scss']
})
export class InitialPageComponent implements OnInit {

  firestore = inject(Firestore);
  router = inject(Router);
  dialog = inject(MatDialog);

  barbearias: any[] = [];
  filteredBarbearias: any[] = [];
  selectedFilters: string[] = [];

  comodidades: string[] = ['Sinuca', 'TV', 'Wi-Fi', 'Ar-Condicionado'];
  tiposAtendimento: string[] = ['Atende Autista', 'Cabelo Crespo', 'Atende Domicílio', 'Atende Eventos'];

  ngOnInit(): void {
    this.loadBarbearias();
  }

  loadBarbearias() {
    const barbeariaRef = collection(this.firestore, 'barbearia');
    collectionData(barbeariaRef, { idField: 'id' }).subscribe(data => {
      this.barbearias = data;
      this.filteredBarbearias = this.barbearias;
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBarbearias = this.barbearias.filter(barbearia =>
      this.removeAccents(barbearia.nomeFantasia.toLowerCase()).includes(this.removeAccents(query)) ||
      this.removeAccents(barbearia.cidade.toLowerCase()).includes(this.removeAccents(query))
    );
  }

  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Abre o modal de filtro
  openModalFilter() {
    const dialogRef = this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '610px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilter(result);
      }
    });
  }

  applyFilter(filterData: any) {
    const { estado, cidade, comodidades, tiposAtendimento } = filterData;

    this.selectedFilters = [];

    this.filteredBarbearias = this.barbearias.filter(barbearia => {
      const matchEstado = estado ? barbearia.estado === this.getEstadoSigla(estado) : true;
      if (estado) this.selectedFilters.push(estado);

      const matchCidade = cidade ? barbearia.cidade === cidade : true;
      if (cidade) this.selectedFilters.push(cidade);

      const selectedComodidades = comodidades
        .map((checked: boolean, index: number) => checked ? this.comodidades[index] : null)
        .filter((item: string | null) => item);

      const matchComodidades = selectedComodidades.length
        ? selectedComodidades.every((comodidade: string) => barbearia.comodidades.includes(comodidade))
        : true;

      if (selectedComodidades.length > 0) this.selectedFilters.push(...selectedComodidades);

      const matchTiposAtendimento = tiposAtendimento.every((tipo: string) => {
        if (tipo === 'Atende Autista') return barbearia.atendeAutista === true;
        if (tipo === 'Cabelo Crespo') return barbearia.experienciaCrespo === true;
        if (tipo === 'Atende Domicílio') return barbearia.atendeDomicilio === true;
        if (tipo === 'Atende Eventos') return barbearia.servicoEventos === true;
        return false;
      });

      if (tiposAtendimento.length > 0) this.selectedFilters.push(...tiposAtendimento);

      return matchEstado && matchCidade && matchComodidades && matchTiposAtendimento;
    });
  }

  removeFilter(filter: string) {
    this.selectedFilters = this.selectedFilters.filter(f => f !== filter);
    this.applyFilter({});
  }

  getEstadoSigla(nomeEstado: string): string {
    const estadosMap: { [key: string]: string } = {
      'Acre': 'AC',
      'Alagoas': 'AL',
      'Amapá': 'AP',
      'Amazonas': 'AM',
      'Bahia': 'BA',
      'Ceará': 'CE',
      'Distrito Federal': 'DF',
      'Espírito Santo': 'ES',
      'Goiás': 'GO',
      'Maranhão': 'MA',
      'Mato Grosso': 'MT',
      'Mato Grosso do Sul': 'MS',
      'Minas Gerais': 'MG',
      'Pará': 'PA',
      'Paraíba': 'PB',
      'Paraná': 'PR',
      'Pernambuco': 'PE',
      'Piauí': 'PI',
      'Rio de Janeiro': 'RJ',
      'Rio Grande do Norte': 'RN',
      'Rio Grande do Sul': 'RS',
      'Rondônia': 'RO',
      'Roraima': 'RR',
      'Santa Catarina': 'SC',
      'São Paulo': 'SP',
      'Sergipe': 'SE',
      'Tocantins': 'TO'
    };
    return estadosMap[nomeEstado] || nomeEstado;
  }

  clearSearch() {
    this.filteredBarbearias = this.barbearias;
    this.selectedFilters = [];
  }

  goToBarbearia(id: string) {
    this.router.navigate(['/barbearia', id]).then(() => {
      console.log(`Navigated to barbearia with ID: ${id}`);
    });
  }
}
