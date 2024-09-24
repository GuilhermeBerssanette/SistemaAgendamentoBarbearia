import {Component, inject} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {LoginComponent} from "./pages/user/login/login.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  http = inject(HttpClient)
  title = 'projeto_barbearia';

  logout(): void {
    console.log('logout')
  }
}
