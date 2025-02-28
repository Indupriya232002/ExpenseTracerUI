import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Check for token in local storage
    if (token) {
      return true; // Allow access if token exists
    } else {
      this.router.navigate(['/welcome']); // Redirect to login if no token
      return false;
    }
  }
  
}
