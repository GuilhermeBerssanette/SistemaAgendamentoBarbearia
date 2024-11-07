import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-modal-confirmation-order',
  templateUrl: './modal-confirmation-order.component.html',
  standalone: true,
  imports: [
    MatButton
  ],
  styleUrls: ['./modal-confirmation-order.component.scss']
})
export class ModalConfirmationOrderComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmationOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedTime: string; barberName: string; serviceName: string; servicePrice: number }
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
