import { Component, inject, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { BarbeariasService } from '../../../services/barbearias.service';
import { ModalFilterComponent } from './modals/modal-filter/modal-filter.component';

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss']
})
export class InitialPageComponent implements OnInit {

  http = inject(HttpClient);
  router = inject(Router);

  barbearias: any[] = [];
  filteredBarbearias: any[] = [];

  dropdownOpen = false;  // Controla a visibilidade do dropdown

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
    this.router.navigate(['/barbearia', id]).then(() => {
      console.log(`Navigated to barbearia with ID: ${id}`);
    });
  }

  openModalFilter() {
    this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '610px'
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Navegar para a página de editar perfil
  goToEditProfile() {
    this.dropdownOpen = false;  // Fechar o dropdown ao navegar
    this.router.navigate(['/edit-profile']).then(() => {
      console.log('Navigated to Edit Profile');
    });
  }

  // Navegar para a página de barbearias favoritas
  goToFavorites() {
    this.dropdownOpen = false;  // Fechar o dropdown ao navegar
    this.router.navigate(['/favorites']).then(() => {
      console.log('Navigated to Favorites');
    });
  }

  logout() {
    this.dropdownOpen = false;  // Fechar o dropdown
    // Implementar lógica de logout aqui
    console.log('Usuário deslogado');
  }

  // Fechar o dropdown se clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownOpen = false;
    }
  }
}
