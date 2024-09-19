import { Routes } from '@angular/router';
import { LoginComponent} from "./pages/login/login.component";
import { RegisterComponent} from "./pages/register/register.component";
import {InitialPageComponent} from "./pages/initial-page/initial-page.component";
import {RegisterBarbeariaComponent} from "./pages/register-barbearia/register-barbearia.component";
import {BarbershopComponent} from "./pages/barbershop/barbershop.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'initial-page', component: InitialPageComponent},
  {path: 'register-barbearia', component: RegisterBarbeariaComponent},
  { path: 'barbearia/:id', component: BarbershopComponent },
];
