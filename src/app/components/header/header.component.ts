import { Router, RouterLink } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { RegisterComponent } from '../../pages/user/register/register.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RegisterComponent, RouterLink ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dropdownOpen: boolean = false;
  router: any;

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
