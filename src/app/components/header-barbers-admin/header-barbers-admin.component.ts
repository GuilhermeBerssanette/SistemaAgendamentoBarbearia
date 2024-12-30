import { Component, HostListener, OnInit } from '@angular/core';
import { Auth, signOut } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { doc, Firestore, getDoc } from "@angular/fire/firestore";
import { MatIcon } from '@angular/material/icon';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-header-barbers-admin',
  templateUrl: './header-barbers-admin.component.html',
  styleUrls: ['./header-barbers-admin.component.scss'],
  standalone: true,
  imports: [MatIcon, NgIf],
})
export class HeaderBarbersAdminComponent implements OnInit {
  dropdownOpen: boolean = false;
  sidebarOpen: boolean = false;
  profileImageUrl: string | null = null;
  barberEmail: string | null = null;

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

  async logout() {
    this.dropdownOpen = false;
      await signOut(this.auth);
      await this.router.navigate(['/']);
  }

  private async loadBarberProfile(barbeariaId: string, barberId: string): Promise<void> {
    try {
      const barberDocRef = doc(this.firestore, `barbearia/${barbeariaId}/barbers/${barberId}`);
      const barberDoc = await getDoc(barberDocRef);

      if (barberDoc.exists()) {
        const barberData = barberDoc.data();
        this.profileImageUrl = barberData['profileImageUrl'] || null;
        this.barberEmail = barberData['email'] || null;
      } else {
        return;
      }
    } catch (error) {
      return;
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
