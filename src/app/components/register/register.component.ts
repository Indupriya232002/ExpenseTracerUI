import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;
  
  user: Users = { 
    userId:0, 
    firstName : "",
    lastName: "" ,
    email: "",
    password: "",
    confirmpassword:"",
    phoneNum: ""

  }

  userList : Users[]= [];

 validateFirstName = false;
 validateLastName = false;
 validateEmail = false;
 validatePasswordmsg = false;
 validateConfirmPasswordmsg = false;
 validatePhoneNum = false;
 showPassword: boolean = false;
 showConfirmPassword: boolean = false;
 errorMessage : string = "";
 emailErrorMessage : string = "";
 passwordErrorMessage : string = "";
 confirmPasswordErrorMessage:string="";
 phoneNumErrorMessage : string = "";

 isPasswordVisible:boolean = false;

  constructor(private userservice:UsersService, private router: Router,private renderer: Renderer2) { }

  ngOnInit(): void {
    this.resetForm();
    this.getAllUsers();
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

  resetForm()
  {
    this.user = {};
    this.validateFirstName = false;
    this.validateLastName = false;
    this.validateEmail = false;
    this.validatePasswordmsg = false;
    this.validateConfirmPasswordmsg=false;
    this.validatePhoneNum = false;
  }

  validateEmailFormat(email: any): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  }

  validatePassword(password: any): boolean {
    if (password.length < 7) {
      return false;
    } 
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharacters.test(password)) {
      return false;
    }
    return true;
  }

  validateConfirmPassword(confirmPassword: any): boolean {
    if (confirmPassword.length < 7) {
      return false;
    } 
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharacters.test(confirmPassword)) {
      return false;
    }
    return true;
  }


  validatePhoneNumber(phoneNumber: any): boolean {
    return phoneNumber.toString().length === 10;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInput.nativeElement.type = this.isPasswordVisible ? 'text' : 'password';
  }

  getAllUsers()
  {
    this.userservice.getAllUsers().subscribe({
      next:(response)=>{
        this.userList = response;
      },
      error:(error)=>
      {
        Swal.fire({
          icon:'error',
          title:'Error....!!!',
          showConfirmButton:true,
        });
      }
    });
  }
  
  onRegister()
  {
    this.validateFirstName = false;
    this.validateLastName = false;
    this.validateEmail = false;
    this.validatePasswordmsg = false;
    this.validateConfirmPasswordmsg=false;
    this.validatePhoneNum = false;

    if(!this.user.firstName || this.user.firstName.trim() === '')
    {
      this.validateFirstName = true;
      this.errorMessage = "First Name is Required";
    }
    if(!this.user.lastName || this.user.lastName.trim() === '')
    {
      this.validateLastName = true;
      this.errorMessage = "Last Name is Required";
    }
    if(!this.user.email)
    {
      this.validateEmail = true;
      this.emailErrorMessage = "Email  is Required";
    }else if(!this.validateEmailFormat(this.user.email))
    {
      this.validateEmail = true;
      this.user.email = '';
      this.emailErrorMessage = "Please enter a valid email address in lowercase ending with '@gmail.com'.";
    }
    if(!this.user.password)
    {
      this.validatePasswordmsg = true;
      this.passwordErrorMessage = "Password id Required.";
    }
    else if(!this.validatePassword(this.user.password))
    {
      this.validatePasswordmsg = true;
      this.user.password = '';
      this.passwordErrorMessage = "Password must be at least 7 characters along with one special character."
    }
    if(!this.user.confirmpassword)
      {
        this.validateConfirmPasswordmsg = true;
        this.confirmPasswordErrorMessage = "Confirm Password id Required.";
      }
      else if(!this.validateConfirmPassword(this.user.confirmpassword))
      {
        this.validateConfirmPasswordmsg = true;
        this.user.confirmpassword = '';
        this.confirmPasswordErrorMessage = "Confirm Password must be at least 7 characters along with one special character."
      }
    if(!this.user.phoneNum)
    {
      this.validatePhoneNum = true;
      this.phoneNumErrorMessage = "Phone Number is Required.";
    }else if(!this.validatePhoneNumber(this.user.phoneNum))
    {
      this.validatePhoneNum = true;
      this.user.phoneNum = '';
      this.phoneNumErrorMessage = "Phone Number must be 10 digits.";
    }

    if(this.validateFirstName || this.validateLastName || this.validateEmail || this.validatePasswordmsg || this.validateConfirmPasswordmsg|| this.validatePhoneNum)
    {
      return;
    }

    let isItemFound = false;

    this.userList.forEach((ele)=>
    {
      let match = true;
      for(const key in ele)
      {
        if(key != 'userId' && (key == "email" || key == "phoneNum"))
        {
          if((ele as any)[key] != (this.user as any)[key]){
            match = false;
            continue;
          }
          else{
              match = true;
              break;
          }
        }
      }

      if(match)
      {
        isItemFound = true;
        Swal.fire({
          icon:'error',
          title:'User already exists',
          showConfirmButton:true,
        });
        return;
      }
    });

    if(!isItemFound)
    {
      this.userservice.signUp(this.user).subscribe({
        next:(response) =>
        {
          if(response.message == "Account Created Successfully")
            {
              const userName =this.user.email;
              localStorage.setItem('email', userName);
            }
          Swal.fire({
            icon: 'success',
            title: 'User Registered Successfully...!',
            showConfirmButton: true,
          });
          this.router.navigate(['/login']);
          this.resetForm();
        },
        error:(error)=>
        {
          Swal.fire({
            icon:'error',
            title:'Error during registration',
            showConfirmButton:true,
          });
        }

      });
    }

  }

}
