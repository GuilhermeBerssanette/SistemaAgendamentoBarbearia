import { Component } from '@angular/core';
import {ModalFilterComponent} from "../modals/modal-filter/modal-filter.component";
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent {

  constructor(public dialog: MatDialog) {

  }

  openModalFilter() {
    this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '410px'
    });
  }

}
