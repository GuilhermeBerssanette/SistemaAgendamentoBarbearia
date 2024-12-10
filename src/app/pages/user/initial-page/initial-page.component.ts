import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData, getDocs } from '@angular/fire/firestore';
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
  tiposAtendimento: string[] = ['Atende Domicílio', 'Atende Autista', 'Cabelo Crespo', 'Atende Eventos'];

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

  openModalFilter() {
    const dialogRef = this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '710px',
      disableClose: true,
      data: { comodidades: this.comodidades, tiposAtendimento: this.tiposAtendimento }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilter(result);
      }
    });
  }

  async applyFilter(filterData: any) {
    const { estado, cidade, comodidades, tiposAtendimento } = filterData;

    let barbeariasFiltradas: any[] = [...this.barbearias];
    this.selectedFilters = []; // Reset filters

    if (estado) {
      const estadoSigla = this.getEstadoSigla(estado);
      barbeariasFiltradas = barbeariasFiltradas.filter(barbearia => barbearia.estado === estadoSigla);
      this.addFilterOnce(estado);
    }

    if (cidade) {
      barbeariasFiltradas = barbeariasFiltradas.filter(barbearia => barbearia.cidade.toLowerCase() === cidade.toLowerCase());
      this.addFilterOnce(cidade);
    }

    // Corrigindo o processamento das comodidades
    if (comodidades.length > 0) {
      barbeariasFiltradas = barbeariasFiltradas.filter(barbearia =>
        comodidades.every((comodidade: string) => barbearia.comodidades.includes(comodidade))
      );

      comodidades.forEach((c: string) => this.addFilterOnce(c));
    }

    if (tiposAtendimento.length > 0) {
      barbeariasFiltradas = await this.filterByTiposAtendimento(barbeariasFiltradas, tiposAtendimento);
      tiposAtendimento.forEach((t: string) => this.addFilterOnce(t));
    }

    this.filteredBarbearias = barbeariasFiltradas;
  }


  async filterByTiposAtendimento(barbearias: any[], tiposAtendimento: string[]): Promise<any[]> {
    const barbeariasFiltradas: any[] = [];

    for (const barbearia of barbearias) {
      const barberCollectionRef = collection(this.firestore, `barbearia/${barbearia.id}/barbers`);
      const barbersSnapshot = await getDocs(barberCollectionRef);

      for (const barberDoc of barbersSnapshot.docs) {
        const barberData = barberDoc.data();

        const matchAtendimento = tiposAtendimento.every((tipo: string): boolean => {
          if (tipo === 'Atende Domicílio') return barberData['atendeDomicilio'];
          if (tipo === 'Atende Autista') return barberData['atendeAutista'];
          if (tipo === 'Cabelo Crespo') return barberData['experienciaCrespo'];
          if (tipo === 'Atende Eventos') return barberData['servicoEventos'];
          return false;
        });

        if (matchAtendimento) {
          barbeariasFiltradas.push(barbearia);
          break;
        }
      }
    }

    return barbeariasFiltradas;
  }

  addFilterOnce(filter: string) {
    if (!this.selectedFilters.includes(filter)) {
      this.selectedFilters.push(filter);
    }
  }

  removeFilter(filter: string) {
    this.selectedFilters = this.selectedFilters.filter(f => f !== filter);

    const remainingFilters = {
      estado: '',
      cidade: '',
      comodidades: [] as string[],
      tiposAtendimento: [] as string[]
    };

    this.selectedFilters.forEach((f: string) => {
      if (this.comodidades.includes(f)) {
        (remainingFilters.comodidades as string[]).push(f);
      }
      if (this.tiposAtendimento.includes(f)) {
        (remainingFilters.tiposAtendimento as string[]).push(f);
      }
    });

    this.applyFilter(remainingFilters).catch(error =>
      console.error('Error removing filter:', error)
    );
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
}
