import {Component, OnInit} from '@angular/core';
import {ModalFilterComponent} from "../modals/modal-filter/modal-filter.component";
import { MatDialog } from '@angular/material/dialog';
import {RouterLink} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {BarbeariasService} from "../../services/barbearias.service";


@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent implements OnInit{

  barbearias: any[] = [];

  constructor(public dialog: MatDialog,
              private barbeariasService: BarbeariasService) {

  }

  async ngOnInit() {
    this.barbearias = await this.barbeariasService.getBarbearias();
  }

  openModalFilter() {
    this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '410px'
    });
  }

}
