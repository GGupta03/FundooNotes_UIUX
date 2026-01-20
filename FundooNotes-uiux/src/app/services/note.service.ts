import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Note {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
  labels?: Label[];
  reminders?: Reminder[];
  collaborators?: Collaborator[];
  color?: string;
}

export interface CreateNoteRequest {
  title: string;
  description: string;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
  isArchived?: boolean;
  isTrashed?: boolean;
  color?: string;
}

export interface Label {
  id: string;
  name: string;
}

export interface Reminder {
  id: string;
  reminderTime: string;
}

export interface Collaborator {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all notes
   */
  getAllNotes(): Observable<any> {
    return this.apiService.get<any>('/notes');
  }

  /**
   * Get single note by ID
   */
  getNote(noteId: number): Observable<any> {
    return this.apiService.get<any>(`/notes/${noteId}`);
  }

  /**
   * Create a new note
   */
  createNote(request: any): Observable<any> {
    return this.apiService.post<any>('/notes', request);
  }

  /**
   * Update note
   */
  updateNote(noteId: number, request: any): Observable<any> {
    return this.apiService.put<any>(`/notes/${noteId}`, request);
  }

  /**
   * Archive note
   */
  archiveNote(noteId: number): Observable<any> {
    return this.apiService.patch<any>(`/notes/${noteId}/archive`, {});
  }

  /**
   * Pin note
   */
  pinNote(noteId: number): Observable<any> {
    return this.apiService.patch<any>(`/notes/${noteId}/pin`, {});
  }

  /**
   * Delete note permanently
   */
  deleteNote(noteId: number): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}`);
  }

  /**
   * Change note color
   */
  changeNoteColor(noteId: number, color: string): Observable<any> {
    return this.apiService.patch<any>(`/notes/${noteId}/color`, { color });
  }

  /**
   * Add label to note
   */
  addLabelToNote(noteId: number, labelId: number): Observable<any> {
    return this.apiService.post<any>(`/notes/${noteId}/labels/${labelId}`, {});
  }

  /**
   * Remove label from note
   */
  removeLabelFromNote(noteId: number, labelId: number): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}/labels/${labelId}`);
  }

  /**
   * Add collaborator to note
   */
  addCollaborator(noteId: number, email: string): Observable<any> {
    return this.apiService.post<any>(`/notes/${noteId}/collaborators`, { email });
  }

  /**
   * Remove collaborator from note
   */
  removeCollaborator(noteId: number, collaboratorId: number): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}/collaborators/${collaboratorId}`);
  }
}
