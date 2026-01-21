import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Label {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor(private apiService: ApiService) {}

  // Get all labels
  getLabels(): Observable<Label[]> {
    return this.apiService.get<Label[]>('labels');
  }

  // Create label
  createLabel(name: string): Observable<any> {
    return this.apiService.post('labels', { name });
  }

  // Update label
  updateLabel(id: number, name: string): Observable<any> {
    return this.apiService.put(`labels/${id}`, { name });
  }

  // Delete label
  deleteLabel(id: number): Observable<any> {
    return this.apiService.delete(`labels/${id}`);
  }
}
