import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Label {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = `${environment.apiUrl}/labels`;
  private labelsSubject = new BehaviorSubject<Label[]>([]);
  public labels$ = this.labelsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all labels
  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(labels => this.labelsSubject.next(labels))
      );
  }

  // Create label
  createLabel(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { name }, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.getLabels().subscribe())
      );
  }

  // Update label
  updateLabel(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { name }, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.getLabels().subscribe())
      );
  }

  // Delete label
  deleteLabel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.getLabels().subscribe())
      );
  }
}
