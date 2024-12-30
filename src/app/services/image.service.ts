import { Injectable } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private storage = getStorage();

  async getGalleryItems(barberId: string): Promise<{ imageUrl: string, comment: string, filePath: string }[]> {
      const galleryRef = ref(this.storage, `gallery/${barberId}`);
      const gallerySnapshot = await listAll(galleryRef);

      return await Promise.all(
        gallerySnapshot.items.map(async (item) => {
          const imageUrl = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const comment = metadata.customMetadata?.['comment'] || 'Sem comentário';
          const filePath = item.fullPath;
          return { imageUrl, comment, filePath };
        })
      );
  }
}
