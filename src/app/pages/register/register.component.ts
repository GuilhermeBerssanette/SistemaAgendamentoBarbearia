import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  http = inject(HttpClient);
  authService = inject(AuthService)
  router = inject(Router)

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue()

    if(rawForm.email === null || rawForm.password === null){
      return;
    }

    this.authService.register(rawForm.email, rawForm.password);

    this.router.navigate(['']).then();

  }
}
