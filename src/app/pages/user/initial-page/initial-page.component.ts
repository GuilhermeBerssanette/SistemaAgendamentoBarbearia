import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { BarbeariasService } from '../../../services/barbearias.service';
import {ModalFilterComponent} from "./modals/modal-filter/modal-filter.component";

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    RouterLink
  ],
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss']
})
export class InitialPageComponent implements OnInit {

  http = inject(HttpClient);
  router = inject(Router);

  barbearias: any[] = [];
  filteredBarbearias: any[] = [];

  constructor(public dialog: MatDialog, private barbeariasService: BarbeariasService) {}

  async ngOnInit() {
    this.barbearias = await this.barbeariasService.getBarbearias();
    this.filteredBarbearias = this.barbearias;
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBarbearias = this.barbearias.filter(barbearia =>
      this.removeAccents(barbearia.nomeFantasia.toLowerCase()).includes(this.removeAccents(query)) ||
      this.removeAccents(barbearia.cidade.toLowerCase()).includes(this.removeAccents(query))
    );
  }

  removeAccents(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  clearSearch() {
    this.filteredBarbearias = this.barbearias;
  }

  goToBarbearia(id: string) {
    this.router.navigate(['/barbearia', id]).then();
  }

  openModalFilter() {
    this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '410px'
    });
  }
}
