import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetService } from 'src/app/services/reset.service';
import Swal from 'sweetalert2';

declare var Stats: any;
declare let particlesJS: any;
declare global {
  interface Window {
    pJSDom: any[];
  }
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput', { static: false }) confirmPasswordInput!: ElementRef;

  isPasswordVisible: boolean = false;
  isnewPasswordVisible: boolean = false;
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = '';
  passwordMismatch: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  validateNewPassword: boolean = false;
  validateConfirmPassword: boolean = false;
  newPasswordErrorMessage: string = 'New password is required.';
  confirmPasswordErrorMessage: string = 'Confirm password is required.';
  constructor(private resertService: ResetService, private route: ActivatedRoute,private router: Router,private renderer: Renderer2) 
  {
    
  }
  resetForm()
  {
    this.newPassword = '';
    this.confirmPassword = '';
    this.validateNewPassword = false;
    this.validateConfirmPassword = false;
    this.passwordMismatch = false;
  }
  ngOnInit(): void {
    this.loadParticles();
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

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInput.nativeElement.type = this.isPasswordVisible ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    this.confirmPasswordInput.nativeElement.type = this.isConfirmPasswordVisible ? 'text' : 'password';
  }

  onResetPassword() {
    this.validateNewPassword = !this.newPassword;
    this.validateConfirmPassword = !this.confirmPassword;
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }

  togglePasswordVisibilityForConfirmpass(): void {
    this.isnewPasswordVisible = !this.isnewPasswordVisible;
    this.confirmPasswordInput.nativeElement.type = this.isnewPasswordVisible ? 'text' : 'password';
  }

  validatePassword(password: string): boolean {
    if (password.length < 7) {
      return false;
    }
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharacters.test(password);
  }

  onInputChange(): void {
    this.validateNewPassword = !this.newPassword || !this.validatePassword(this.newPassword);
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
    if (!this.confirmPassword) {
      this.passwordMismatch = false; // Reset error if confirm password is empty
    }
  }

   resetPassword() {
    const email = localStorage.getItem('email');  // Retrieve reset token from local storage

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Email Missing',
        text: 'Email is missing to reset your password.'
      });
      return;  // Early exit if email is missing
    }
  
    
    this.validateNewPassword = false;
    this.validateConfirmPassword = false;
    this.passwordMismatch = false;

    // Validate New Password field
    if (!this.newPassword || this.newPassword.trim() === '') {
      this.validateNewPassword = true;
      this.newPasswordErrorMessage = "New Password is Required";
    } else if (!this.validatePassword(this.newPassword)) {
      this.validateNewPassword = true;
      this.newPassword = '';
      this.newPasswordErrorMessage = "New Password must be at least 7 characters long, including one special character.";
    }

    // Validate Confirm Password field
    if (!this.confirmPassword || this.confirmPassword.trim() === '') {
      this.validateConfirmPassword = true;
      this.confirmPasswordErrorMessage = "Confirm Password is Required";
    } else if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      this.confirmPasswordErrorMessage = "The new password and confirm password do not match.";
    }

    // If any validation fails, do not proceed
    if (this.validateNewPassword || this.validateConfirmPassword || this.passwordMismatch) {
      return;
    }

    const otpVerified = localStorage.getItem('otpverified');
    if (otpVerified != 'true') {
      Swal.fire({
        icon: 'error',
        title: 'OTP Not Verified',
        text: 'Please verify your OTP first before resetting the password.'
      });
      this.newPassword = '';  // Clear new password on error
      this.confirmPassword = '';  // Clear confirm password on error
      return;  // Early exit if OTP is not verified
    }

    // Call service to reset the password
    this.resertService.resetPassword(email, this.newPassword,this.confirmPassword).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Success',
          text: 'Your password has been reset successfully. You can now log in with your new password.'
        });
        this.newPassword = '';  // Clear new password after success
        this.confirmPassword = '';  // Clear confirm password after success
        localStorage.removeItem('otpverified');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Resetting Password',
          text: error.error.message || 'There was an issue resetting your password. Please try again later.'
        });
        this.newPassword = '';  // Clear new password on error
        this.confirmPassword = '';  // Clear confirm password on error
      }
    });
  }
}
