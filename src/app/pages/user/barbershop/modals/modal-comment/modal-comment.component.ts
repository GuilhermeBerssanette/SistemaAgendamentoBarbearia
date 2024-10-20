import { Component, Inject, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Timestamp } from '@firebase/firestore';
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-modal-comment',
  templateUrl: './modal-comment.component.html',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./modal-comment.component.scss']
})
export class ModalCommentComponent implements OnInit {
  comments: any[] = [];
  form: FormGroup;

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<ModalCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barbeariaId: string }
  ) {
    this.form = new FormGroup({
      comment: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void { // Não precisamos de async/await aqui
    const commentsCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/comments`);
    collectionData(commentsCollectionRef, { idField: 'id' }).subscribe(data => {
      this.comments = data;
    });
  }

  async submitComment() {
    if (this.form.valid) {
      const newComment = {
        userId: '12345',
        userName: 'Usuário Teste',
        comment: this.form.value.comment,
        date: Timestamp.now(),
      };

      const commentsCollectionRef = collection(this.firestore, `barbearia/${this.data.barbeariaId}/comments`);
      await addDoc(commentsCollectionRef, newComment);
      this.form.reset();

    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
