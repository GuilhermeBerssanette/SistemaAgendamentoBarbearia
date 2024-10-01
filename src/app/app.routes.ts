import { Routes } from '@angular/router';
import { LoginComponent} from "./pages/user/login/login.component";
import { RegisterComponent} from "./pages/user/register/register.component";
import {InitialPageComponent} from "./pages/user/initial-page/initial-page.component";
import {RegisterBarbeariaComponent} from "./pages/admin/register-barbearia/register-barbearia.component";
import {BarbershopComponent} from "./pages/user/barbershop/barbershop.component";
import {BarbershopAdminComponent} from "./pages/admin/barbershop-admin/barbershop-admin.component";
import {ModalRegisterBarbeiroComponent} from "./pages/admin/barbershop-admin/modals/modal-register-barbeiro/modal-register-barbeiro.component";
import { BarbersComponent } from "./pages/user/barbers/barbers.component";
import {BarberAdminComponent} from "./pages/admin/barber-admin/barber-admin.component";


export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'initial-page', component: InitialPageComponent},
  {path: 'register-barbearia', component: RegisterBarbeariaComponent},
  {path: 'barbearia/:id', component: BarbershopComponent},
  {path: 'barbearia/:id/admin', component: BarbershopAdminComponent},
  {path: 'barbearia/:id/cadastrar-barbeiro', component: ModalRegisterBarbeiroComponent},
  {path: 'barbearia/:id/barber/:barberId', component: BarbersComponent},
  {path: 'barbearia/:id/barber/:barberId/admin', component: BarberAdminComponent}



];
