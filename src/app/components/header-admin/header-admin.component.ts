import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";
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
export class HeaderAdminComponent implements OnInit {
  dropdownOpen: boolean = false;
  sidebarOpen = false;
  barbeiro: any;

  constructor(private auth: Auth, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
