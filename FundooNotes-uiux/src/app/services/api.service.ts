import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('API Service initialized with URL:', this.apiUrl);
  }

  /**
   * Get authorization headers with JWT token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Generic GET request
   */
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log('GET:', url);
    return this.http.get<T>(url, {
      headers: this.getHeaders()
    });
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log('POST:', url, body);
    return this.http.post<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log('PUT:', url, body);
    return this.http.put<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Generic PATCH request
   */
  patch<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log('PATCH:', url, body);
    return this.http.patch<T>(url, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    console.log('DELETE:', url);
    return this.http.delete<T>(url, {
      headers: this.getHeaders()
    });
  }
}
