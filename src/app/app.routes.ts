import { Routes } from '@angular/router';
import { LoginComponent} from "./pages/login/login.component";
import { RegisterComponent} from "./pages/register/register.component";
import {InitialPageComponent} from "./pages/initial-page/initial-page.component";
import {RegisterBarbeariaComponent} from "./pages/register-barbearia/register-barbearia.component";
import {BarbershopComponent} from "./pages/barbershop/barbershop.component";
import {BarbershopAdminComponent} from "./pages/barbershop-admin/barbershop-admin.component";
import {ModalRegisterBarbeiroComponent} from "./pages/barbershop-admin/modals/modal-register-barbeiro/modal-register-barbeiro.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'initial-page', component: InitialPageComponent},
  {path: 'register-barbearia', component: RegisterBarbeariaComponent},
  {path: 'barbearia/:id', component: BarbershopComponent},
  {path: 'barbearia/:id/admin', component: BarbershopAdminComponent},
  {path: 'barbearia/:id/cadastrar-barbeiro', component: ModalRegisterBarbeiroComponent}
];
