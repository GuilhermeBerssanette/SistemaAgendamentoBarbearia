import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { RegisterComponent } from '../../pages/user/register/register.component';
import { Auth, signOut } from '@angular/fire/auth';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  standalone: true,
  imports: [RegisterComponent, RouterLink, MatIcon, ],
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent {
  dropdownOpen: boolean = false;
  sidebarOpen = false;
  barbeiro: any;

  constructor(private auth: Auth, private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
