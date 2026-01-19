import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Label {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateLabelRequest {
  name: string;
}

export interface UpdateLabelRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all labels
   */
  getLabels(): Observable<Label[]> {
    return this.apiService.get<Label[]>('/labels');
  }

  /**
   * Create new label
   */
  createLabel(request: CreateLabelRequest): Observable<Label> {
    return this.apiService.post<Label>('/labels', request);
  }

  /**
   * Update label
   */
  updateLabel(labelId: string, request: UpdateLabelRequest): Observable<Label> {
    return this.apiService.put<Label>(`/labels/${labelId}`, request);
  }

  /**
   * Delete label
   */
  deleteLabel(labelId: string): Observable<any> {
    return this.apiService.delete<any>(`/labels/${labelId}`);
  }
}
