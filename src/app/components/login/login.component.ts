import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;


  user = {
    email: '',
    password: ''
  };

  validateEmail = false;
  validatePasswordmsg = false;
  emailErrorMessage = '';
  passwordErrorMessage = '';
  isPasswordVisible = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(private userservice: UsersService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    if (password.length < 7) {
      return false;
    }
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharacters.test(password);
  }

  loginUser() {
    this.validateEmail = false;
    this.validatePasswordmsg = false;

    if (!this.user.email) {
      this.validateEmail = true;
      this.emailErrorMessage = "Email is Required";
    } else if (!this.validateEmailFormat(this.user.email)) {
      this.validateEmail = true;
      this.user.email = '';
      this.emailErrorMessage = "Please enter a valid email ending with '@gmail.com'.";
    }

    if (!this.user.password) {
      this.validatePasswordmsg = true;
      this.passwordErrorMessage = "Password is Required.";
    } else if (!this.validatePassword(this.user.password)) {
      this.validatePasswordmsg = true;
      this.user.password = '';
      this.passwordErrorMessage = "Password must be at least 7 characters with a special character.";
    }

    if (this.validateEmail || this.validatePasswordmsg) {
      return;
    }

    this.userservice.login(this.user).subscribe({
      next: (response) => {
        if (response?.token !== "Invalid username or password") {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', this.user.email);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have successfully logged in!',
          }).then(() => {
            this.router.navigate(['/sidebar']);
            this.resetForm();
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid username or password. Please try again.',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Something went wrong. Please try again later.',
        });
      }
    });
  }

  resetForm() {
    this.user.email = '';
    this.user.password = '';
    this.validateEmail = false;
    this.validatePasswordmsg = false;
  }
}
