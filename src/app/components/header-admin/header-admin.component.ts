import { Component, HostListener } from '@angular/core';
import {Auth, signOut} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent {
  dropdownOpen: boolean = false;


  constructor(private auth: Auth, private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

   goToEditProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/edit-profile']).then(() => {
      console.log('Navigated to Edit Profile');
    });
  }

  goToFavorites() {
    this.dropdownOpen = false;
    this.router.navigate(['/favorites']).then(() => {
      console.log('Navigated to Favorites');
    });
  }

  async logout() {
    this.dropdownOpen = false;
    try {
      await signOut(this.auth);
      console.log('Usuário deslogado');
      await this.router.navigate(['/']);
      console.log('Navegação para a página inicial concluída');
    } catch (error) {
      console.error('Erro ao fazer logout ou navegar:', error);
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
