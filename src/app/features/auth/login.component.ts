import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    this.authService.login(this.form).subscribe({
      next: () => {
        if (!this.authService.isLoggedIn()) {
          this.errorMessage =
            'Login succeeded but no token was returned by the API.';
          return;
        }

        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.errorMessage = 'Unable to login. Please check your credentials.';
      }
    });
  }
}
