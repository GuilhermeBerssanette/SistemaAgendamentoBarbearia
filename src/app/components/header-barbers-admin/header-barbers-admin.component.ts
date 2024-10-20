import { Component, HostListener, OnInit } from '@angular/core';
import { Auth, signOut } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";

@Component({
  selector: 'app-header-barbers-admin',
  templateUrl: './header-barbers-admin.component.html',
  standalone: true,
  styleUrls: ['./header-barbers-admin.component.scss']
})
export class HeaderBarbersAdminComponent implements OnInit {
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
    const barberId = this.route.snapshot.paramMap.get('barberId');
    if (barbeariaId && barberId) {
      await this.loadBarberProfile(barbeariaId, barberId);
    }
  }

  async loadBarberProfile(barbeariaId: string, barberId: string): Promise<void> {
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownOpen = false;
    }
  }
}
