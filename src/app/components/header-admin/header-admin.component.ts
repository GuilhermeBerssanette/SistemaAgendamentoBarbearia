import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Auth, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  standalone: true,
  imports: [MatIcon, NgIf],
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {
  dropdownOpen: boolean = false;
  sidebarOpen: boolean = false;
  profileImageUrl: string | null = null;
  barbeariaName: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    const barbeariaId = this.route.snapshot.paramMap.get('id');

    if (barbeariaId) {
      this.loadBarbeariaData(barbeariaId);
    }
  }

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

  private async loadBarbeariaData(barbeariaId: string): Promise<void> {
    try {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);

      if (barbeariaDoc.exists()) {
        const barbeariaData = barbeariaDoc.data();
        this.profileImageUrl = barbeariaData['profileImageUrl'] || null;
        this.barbeariaName = barbeariaData['nomeFantasia'] || 'Barbearia Desconhecida';
      } else {
        console.error('Barbearia não encontrada!');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da barbearia:', error);
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
