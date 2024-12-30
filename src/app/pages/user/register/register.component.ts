import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true })
  });

  async onSubmit(): Promise<void> {
    const { email, password } = this.form.getRawValue();

    if (email && password) {
        await lastValueFrom(this.authService.register(email, password));
        const navigationSuccess = await this.router.navigate(['/login']);

        if (navigationSuccess) {
          return;
        } else {
          return;
        }
    }
  }
}
