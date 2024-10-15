import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ImageService } from '../../../services/image.service';
import { NgForOf, NgIf } from '@angular/common';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-barber',
  templateUrl: './barbers.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    HeaderComponent
],
  styleUrls: ['./barbers.component.scss']
})
export class BarbersComponent implements OnInit {
  barbeiro: any;
  galleryItems: { imageUrl: string, comment: string, filePath: string }[] = [];
  barberId!: string;
  barbeariaId!: string;
  currentSection: string = 'info';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private ImageService: ImageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.barbeariaId = this.route.snapshot.paramMap.get('id')!;
    this.barberId = this.route.snapshot.paramMap.get('barberId')!;

    if (this.barbeariaId && this.barberId) {
      await this.loadBarberInfo();
      await this.loadGalleryItems();
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

  async loadGalleryItems(): Promise<void> {
    try {
      this.galleryItems = await this.ImageService.getGalleryItems(this.barberId);
    } catch (error) {
      console.error('Erro ao carregar a galeria de imagens:', error);
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
  }
}
