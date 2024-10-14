import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from '@angular/fire/storage';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-barber',
  templateUrl: './barbers.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./barbers.component.scss']
})
export class BarbersComponent implements OnInit {
  barbeiro: any;
  galleryItems: { imageUrl: string, comment: string, filePath: string }[] = [];
  currentSection: string = 'gallery';
  barberId!: string;
  barbeariaId!: string;
  storage = getStorage();

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    this.barbeariaId = this.route.snapshot.paramMap.get('barbeariaId')!;
    this.barberId = this.route.snapshot.paramMap.get('barberId')!;

    if (this.barbeariaId && this.barberId) {
      await this.loadBarberInfo();
      await this.getGalleryItems();
    }
  }

  async loadBarberInfo(): Promise<void> {
    try {
      const barberDocRef = doc(this.firestore, `barbearia/${this.barbeariaId}/barbers/${this.barberId}`);
      const barberDoc = await getDoc(barberDocRef);
      if (barberDoc.exists()) {
        this.barbeiro = barberDoc.data();
      } else {
        console.error('Barbeiro não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao carregar informações do barbeiro:', error);
    }
  }

  async getGalleryItems(): Promise<void> {
    try {
      const galleryRef = ref(this.storage, `gallery/${this.barberId}`);
      const gallerySnapshot = await listAll(galleryRef);

      this.galleryItems = await Promise.all(
        gallerySnapshot.items.map(async (item) => {
          try {
            const imageUrl = await getDownloadURL(item);
            const metadata = await getMetadata(item);
            const comment = metadata.customMetadata?.['comment'] || 'Sem comentário';
            const filePath = item.fullPath;
            return { imageUrl, comment, filePath };
          } catch (error) {
            console.error('Erro ao obter informações da imagem:', error);
            return { imageUrl: '', comment: 'Erro ao carregar', filePath: '' };
          }
        })
      );
    } catch (error) {
      console.error('Erro ao carregar a galeria de imagens:', error);
    }
  }

  showSection(section: string) {
    this.currentSection = section;
  }
}
