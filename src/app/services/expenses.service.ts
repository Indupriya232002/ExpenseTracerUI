import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Expenses } from '../models/expenses.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  baseUrl = 'http://localhost:7111/api/Expense/';

  constructor(private http: HttpClient) { }

  addExpense(data: any): Observable<any>{
        // Retrieve the token from local storage or your auth service
        const token = localStorage.getItem('token'); // Change this to your token retrieval method

        // Set the authorization header
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Ensure the content type is set if you're sending JSON
        });
        return this.http.post(this.baseUrl + 'AddExpense', data, { headers });

  }
  getAllExpenses(p0?: { headers: HttpHeaders; }): Observable<Expenses[]>
  {
    return this.http.get<Expenses[]>(this.baseUrl+'GetAllExpenses');
  }
 
  getUserExpenses(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.baseUrl + 'GetUserExpenses', { headers });

  }

  updateExpenses(Expenses: any): Observable<any> {
    const token = localStorage.getItem('token'); // Adjust this based on how you retrieve the token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(this.baseUrl+'UpdateExpenses',Expenses, { headers });
  } 
 
  deleteExpenseById(id : number): Observable<any>
   {
    return this.http.delete(this.baseUrl+'DeleteExpenseById?expenseId='+id, { responseType: 'text' });
   }

   deleteExpenseByUserIdAndExpenseId(userId: string, expenseId: string): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token not found');
      return throwError('Token not found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Correct URL format with both userId and taskId as query parameters
    return this.http.delete<any>(`${this.baseUrl}DeleteExpenseByUserIdAndExpenseId?userId=${userId}&expenseId=${expenseId}`, { headers });
  }

  // getExpensesByDateRange(startDate: string, endDate: string,token: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}GetExpensesByDateRange?startDate=${startDate}&endDate=${endDate}`);
  // }
  getExpensesByDateRange(startDate: string, endDate: string, token: string): Observable<any> { 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);

    return this.http.get<any>(`${this.baseUrl}GetExpensesByDateRange`, { headers, params });
}

  

  // Get daily expenses
  getDailyExpenses(): Observable<any> {
    return this.http.get(`${this.baseUrl}GetDailyExpenses`);
  }
  
}
