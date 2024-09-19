import {Component, inject, OnInit} from '@angular/core';
import {ModalFilterComponent} from "../modals/modal-filter/modal-filter.component";
import { MatDialog } from '@angular/material/dialog';
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {BarbeariasService} from "../../services/barbearias.service";


@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    RouterLink
  ],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent implements OnInit{

  http = inject(HttpClient);
  router = inject(Router)

  barbearias: any[] = [];

  constructor(public dialog: MatDialog,
              private barbeariasService: BarbeariasService) {
  }

  async ngOnInit() {
    this.barbearias = await this.barbeariasService.getBarbearias();
  }

  goToBarbearia(id: string) {
    this.router.navigate(['/barbearia', id]).then();
  }

  openModalFilter() {
    this.dialog.open(ModalFilterComponent, {
      width: '700px',
      height: '410px'
    });
  }

}
