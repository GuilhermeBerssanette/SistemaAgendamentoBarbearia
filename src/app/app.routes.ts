import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/user/login/login.component";
import { RegisterComponent } from "./pages/user/register/register.component";
import { InitialPageComponent } from "./pages/user/initial-page/initial-page.component";
import { RegisterBarbeariaComponent } from "./pages/admin/register-barbearia/register-barbearia.component";
import { BarbershopComponent } from "./pages/user/barbershop/barbershop.component";
import { BarbershopAdminComponent } from "./pages/admin/barbershop-admin/barbershop-admin.component";
import { ModalRegisterBarbeiroComponent } from "./pages/admin/barbershop-admin/modals/modal-register-barbeiro/modal-register-barbeiro.component";
import { BarbersComponent } from "./pages/user/barbers/barbers.component";
import { BarberAdminComponent } from "./pages/admin/barber-admin/barber-admin.component";
import { OrdersComponent } from "./pages/user/orders/orders.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { canActivateAuthGuard } from "./services/auth-guard.service";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'initial-page', component: InitialPageComponent, canActivate: [canActivateAuthGuard] },
  { path: 'register-barbearia', component: RegisterBarbeariaComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id', component: BarbershopComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id/admin', component: BarbershopAdminComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id/cadastrar-barbeiro', component: ModalRegisterBarbeiroComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id/barber/:barberId', component: BarbersComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id/barber/:barberId/orders', component: OrdersComponent, canActivate: [canActivateAuthGuard] },
  { path: 'barbearia/:id/barber/:barberId/admin', component: BarberAdminComponent, canActivate: [canActivateAuthGuard] },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'login' }
];
