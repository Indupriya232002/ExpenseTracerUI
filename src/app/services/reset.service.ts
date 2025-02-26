import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  baseUrl = "http://localhost:7187/api/User/";
  constructor(private http:HttpClient) { }

  resetPassword(email: string, newPassword: string): Observable<any> {
    const payload = { email:email, NewPassword: newPassword };  // Ensure the property names match the backend expectation
    return this.http.post(this.baseUrl + 'ResetPassword', payload);
  }

}
