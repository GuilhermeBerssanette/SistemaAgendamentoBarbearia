import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Barbearias } from "../../../interfaces/barbearias";
import { Barbeiros } from "../../../interfaces/barbeiros";
import { ModalInfoComponent } from "./modals/modal-info/modal-info.component";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { getDownloadURL, getStorage, ref, listAll } from 'firebase/storage';

@Component({
  selector: 'app-barbershop',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, NgOptimizedImage],
  templateUrl: './barbershop.component.html',
  styleUrls: ['./barbershop.component.scss']
})
export class BarbershopComponent implements OnInit {
  barbearia?: Barbearias;
  barbeariaId?: string;
  barbers: Barbeiros[] = [];
  profileImageUrl: string | null = null;  // URL da imagem de perfil

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {}

  async ngOnInit() {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;

    if (this.barbeariaId) {
      const barbeariaDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}`);
      const barbeariaDoc = await getDoc(barbeariaDocRef);
      if (barbeariaDoc.exists()) {
        const barbeariaData = barbeariaDoc.data() as Barbearias;
        this.barbearia = {
          id: barbeariaDoc.id,
          ...barbeariaData,
        } as Barbearias;

        // Carregar a imagem de perfil do Firebase Storage
        await this.loadProfileImage();
      } else {
        console.error("Barbearia não encontrada!");
      }

      const barbersCollection = collection(this.firestore, `barbearia/${this.barbeariaId}/barbers`);
      const querySnapshot = await getDocs(barbersCollection);

      this.barbers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Barbeiros[];
    }
  }

  async loadProfileImage() {
    try {
      const storage = getStorage();
      const profileImageFolderRef = ref(storage, `profile/${this.barbeariaId}`);

      // Listar todos os arquivos no diretório 'profile/{barbeariaId}'
      const result = await listAll(profileImageFolderRef);

      // Procurar o arquivo de perfil que contém 'perfil.barbearia' no nome
      const profileImageItem = result.items.find(item => item.name.includes('perfil.barbearia'));

      if (profileImageItem) {
        this.profileImageUrl = await getDownloadURL(profileImageItem);
      } else {
        this.profileImageUrl = null; // Usar imagem padrão se o arquivo não for encontrado
      }
    } catch (error) {
      console.error('Erro ao carregar a imagem de perfil:', error);
      this.profileImageUrl = null;  // Imagem padrão se não houver perfil
    }
  }

  isAddressValid(): boolean {
    return !!(this.barbearia?.estado && this.barbearia?.cidade && this.barbearia?.rua);
  }

  openGoogleMaps(): void {
    if (this.isAddressValid()) {
      const { estado, cidade, rua, numero } = this.barbearia!;
      const address = `${rua}, ${numero ? numero + ', ' : ''}${cidade}, ${estado}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

      try {
        const newWindow = window.open(url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          alert('Endereço não encontrado. Verifique as informações fornecidas.');
        }
      } catch (error) {
        alert('Erro ao abrir o Google Maps. Por favor, tente novamente.');
      }
    }
  }

  openModalInfos(barber: any, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      width: '300px',
      data: barber
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado');
    });
  }
}
