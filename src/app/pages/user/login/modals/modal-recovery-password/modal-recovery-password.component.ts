import { MatIcon } from '@angular/material/icon';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-modal-recovery-password',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './modal-recovery-password.component.html',
  styleUrl: './modal-recovery-password.component.scss'
})
export class ModalRecoveryPasswordComponent {
  recoveryForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalRecoveryPasswordComponent>,
    private fb: FormBuilder
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.dialogRef.updateSize('500px', '300px');
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      this.dialogRef.close(this.recoveryForm.get('email')?.value);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
