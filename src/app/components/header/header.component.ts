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

  goToFavorites() {
    this.dropdownOpen = false;
    this.dialog.open(ModalFavoritesComponent, {
      width: '600px',
      height: '400px'
    });
  }

  async logout() {
    this.dropdownOpen = false;
      await signOut(this.auth);
      await this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownOpen = false;
    }
  }
}
