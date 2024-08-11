import { Routes } from '@angular/router';
import { LoginComponent} from "./pages/login/login.component";
import { RegisterComponent} from "./pages/register/register.component";
import {InitialPageComponent} from "./pages/initial-page/initial-page.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'initial-page', component: InitialPageComponent, },
];
