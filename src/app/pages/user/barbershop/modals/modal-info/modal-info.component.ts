import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Barbeiros} from "../../../../../interfaces/barbeiros";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Barbeiros, private dialogRef: MatDialogRef<ModalInfoComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
