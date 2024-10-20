import { Component, HostListener, OnInit } from '@angular/core';
import { Auth, signOut } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  standalone: true,
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {
  dropdownOpen: boolean = false;
  profileImageUrl: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  async ngOnInit(): Promise<void> {
    const barbeariaId = this.route.snapshot.paramMap.get('id');
    if (barbeariaId) {
      await this.loadBarbershopProfile(barbeariaId);
    }
  }

  async loadBarbershopProfile(barbeariaId: string): Promise<void> {
    try {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);
      if (barbeariaDoc.exists()) {
        this.profileImageUrl = barbeariaDoc.data()['profileImageUrl'];
      } else {
        console.error('Barbearia não encontrada!');
      }
    } catch (error) {
      console.error('Erro ao carregar imagem da barbearia:', error);
    }
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownOpen = false;
    }
  }
}
