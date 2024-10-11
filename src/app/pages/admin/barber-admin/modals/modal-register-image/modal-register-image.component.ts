import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { arrayUnion, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-modal-register-image',
  standalone: true,
  templateUrl: './modal-register-image.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./modal-register-image.component.scss']
})
export class ModalRegisterImageComponent {
  selectedFile: File | null = null;
  comment: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalRegisterImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string, id: string },
    private firestore: Firestore
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async onSubmit() {
    if (this.selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `barbers/${this.data.barberId}/${this.selectedFile.name}`);

      await uploadBytes(storageRef, this.selectedFile).then(async (snapshot) => {
        const imageUrl = await getDownloadURL(snapshot.ref);

        const barbeiroDocRef = doc(this.firestore, `barbearia/${this.data.id}/barbers/${this.data.barberId}`);
        await updateDoc(barbeiroDocRef, {
          galleryItem: arrayUnion({
            imageUrl: imageUrl,
            comment: this.comment
          })
        });

        this.dialogRef.close();
      });
    }
  }
}
