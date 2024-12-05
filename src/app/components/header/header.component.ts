import { Router, RouterLink } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { RegisterComponent } from '../../pages/user/register/register.component';
import { Auth, signOut } from '@angular/fire/auth';
import { MatIcon } from '@angular/material/icon';
import {NgIf} from "@angular/common";
import {ModalFavoritesComponent} from "./modals/modal-favorites/modal-favorites.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterComponent, RouterLink, MatIcon, NgIf,],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  dropdownOpen: boolean = false;
  sidebarOpen = false;
  barbeiro: any;
  userEmail?: string;

  constructor(private auth: Auth, private router: Router, private dialog: MatDialog) {
    this.auth.onAuthStateChanged((user) => {
      this.userEmail = user?.email || '';
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  goToEditProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/edit-profile']).then(() => {
      console.log('Navigated to Edit Profile');
    });
  }

  goToFavorites() {
    this.dropdownOpen = false;
    this.dialog.open(ModalFavoritesComponent, {
      width: '600px',
      height: '400px'
    });
  }

  async logout() {
    this.dropdownOpen = false;

    if (!confirm('Tem certeza de que deseja sair?')) {
      console.log('Logout cancelado pelo usuário.');
      return;
    }

    try {
      await signOut(this.auth);
      console.log('Usuário deslogado com sucesso.');
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
      await this.router.navigate(['/']);
    }
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownOpen = false;
    }
  }
}
