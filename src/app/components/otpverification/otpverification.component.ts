import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotService } from 'src/app/services/forgot.service';
import Swal from 'sweetalert2';
declare var Stats: any;
declare let particlesJS: any;
declare global {
  interface Window {
    pJSDom: any[];
  }
}

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.component.html',
  styleUrls: ['./otpverification.component.css']
})
export class OtpverificationComponent implements OnInit {

  otp: string[] = ['', '', '', '', '', ''];
  enteredOtp: string = '';
  
  constructor(private router: Router, private forgotservice:ForgotService,private renderer: Renderer2) { }

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

  onOtpInput(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
    const prevInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;

    // Automatically move to the next input box if there is a character
    if (input.value && nextInput) {
      nextInput.focus();
    }

    // If input is empty and user pressed backspace, move focus to previous box
    if (input.value === '' && event.inputType === 'deleteContentBackward' && prevInput) {
      prevInput.focus();
    }
  }

  verifyOtp() {
    const enteredOtp = this.otp.join('');  // Join the OTP array to form a single string
    const storedOtp = localStorage.getItem('generatedOtp');

    if (enteredOtp === storedOtp) {
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'Your OTP is correct. Redirecting to reset password page...'
      }).then(() => {
        localStorage.removeItem('generatedOtp');
        localStorage.setItem('otpverified', 'true');
        this.router.navigate(['/resetpassword']);  // Navigate to reset password page
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'The OTP you entered is incorrect. Please try again.'
      });
    }
  }


}
