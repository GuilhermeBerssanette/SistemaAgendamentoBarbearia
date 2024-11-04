import { Component, HostListener, OnInit } from '@angular/core';
import { Auth, signOut } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header-barbers-admin',
  templateUrl: './header-barbers-admin.component.html',
  styleUrls: ['./header-barbers-admin.component.scss'],
  standalone: true,
  imports: [MatIcon, ]
})
export class HeaderBarbersAdminComponent implements OnInit {
  dropdownOpen: boolean = false;
  sidebarOpen: boolean = false;
  profileImageUrl: string | null = null;
  barbeiro: any;


  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    const barbeariaId = this.route.snapshot.paramMap.get('id');
    const barberId = this.route.snapshot.paramMap.get('barberId');
    if (barbeariaId && barberId) {
      this.loadBarberProfile(barbeariaId, barberId);
    }
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
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  private async loadBarberProfile(barbeariaId: string, barberId: string): Promise<void> {
    try {
      const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
      const barberDoc = await getDoc(barberDocRef);
      if (barberDoc.exists()) {
        this.profileImageUrl = barberDoc.data()['profileImageUrl'];
      } else {
        console.error('Barbeiro não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao carregar imagem do barbeiro:', error);
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
