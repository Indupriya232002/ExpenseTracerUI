import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
declare var Stats: any;
declare let particlesJS: any;
declare global {
  interface Window {
    pJSDom: any[];
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
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
  constructor(private userservice: UsersService, private router: Router,private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadParticles();
  }
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

  
  loadParticles(): void {
    // Load particles.js dynamically
    this.loadScript('assets/particlesjs/particles.js', () => {
      particlesJS.load('particles-js', 'assets/particlesjs/particles.json', function () {
        console.log('Particles.js loaded successfully!');
      });
    });

    // Load app.js
    this.loadScript('assets/particlesjs/app.js', () => {
      console.log('app.js loaded');
    });

    // Load stats.js
    // this.loadScript('assets/particlesjs/stats.js', () => {
    //   this.initStats();
    // });
  }

  loadScript(src: string, callback: () => void) {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.body.appendChild(script);
  }

  initStats(): void {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    const count_particles = document.querySelector('.js-count-particles') as HTMLElement;

    function update() {
      stats.begin();
      stats.end();
      if (window.pJSDom && window.pJSDom[0]?.pJS?.particles?.array) {
        count_particles.innerText = window.pJSDom[0].pJS.particles.array.length.toString();
      }
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }
}
