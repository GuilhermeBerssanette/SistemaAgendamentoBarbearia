import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { NgIf } from "@angular/common";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-register-image',
  templateUrl: './modal-register-image.component.html',
  styleUrl: './modal-register-image.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIcon
  ]
})
export class ModalRegisterImageComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadProgress: number = 0;

  constructor(
    private storage: Storage,
    private dialogRef: MatDialogRef<ModalRegisterImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string }
  ) {
    this.form = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.form.get('image')?.setValue(this.selectedFile.name);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.form.valid && this.selectedFile) {
      const filePath = `gallery/${this.data.barberId}/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = ref(this.storage, filePath);

      const metadata = {
        customMetadata: {
          comment: this.form.value.comment
        }
      };

      const uploadTask = uploadBytesResumable(fileRef, this.selectedFile, metadata);

      uploadTask.on('state_changed',
        (snapshot) => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        },
        () => {
          this.dialogRef.close(false);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
