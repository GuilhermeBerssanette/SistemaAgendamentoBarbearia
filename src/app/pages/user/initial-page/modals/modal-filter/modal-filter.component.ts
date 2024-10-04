import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-modal-filter',
  standalone: true,
  imports: [MatIconModule,],
  templateUrl: './modal-filter.component.html',
  styleUrl: './modal-filter.component.scss'
})
export class ModalFilterComponent {
  [x: string]: any;

    constructor(private dialogRef: MatDialogRef<ModalFilterComponent>){ }

    closeModalFilter(){
      this.dialogRef.close();
    }
}
