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
  getNotes(): Observable<Note[]> {
    return this.apiService.get<Note[]>('/notes');
  }

  /**
   * Get single note by ID
   */
  getNote(noteId: string): Observable<Note> {
    return this.apiService.get<Note>(`/notes/${noteId}`);
  }

  /**
   * Create a new note
   */
  createNote(request: CreateNoteRequest): Observable<Note> {
    return this.apiService.post<Note>('/notes', request);
  }

  /**
   * Update note
   */
  updateNote(noteId: string, request: UpdateNoteRequest): Observable<Note> {
    return this.apiService.put<Note>(`/notes/${noteId}`, request);
  }

  /**
   * Archive note
   */
  archiveNote(noteId: string): Observable<any> {
    return this.apiService.put<any>(`/notes/${noteId}`, { isArchived: true });
  }

  /**
   * Trash note
   */
  trashNote(noteId: string): Observable<any> {
    return this.apiService.put<any>(`/notes/${noteId}`, { isTrashed: true });
  }

  /**
   * Delete note permanently
   */
  deleteNote(noteId: string): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}`);
  }

  /**
   * Add label to note
   */
  addLabelToNote(noteId: string, labelId: string): Observable<any> {
    return this.apiService.post<any>(`/notes/${noteId}/labels/${labelId}`, {});
  }

  /**
   * Remove label from note
   */
  removeLabelFromNote(noteId: string, labelId: string): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}/labels/${labelId}`);
  }

  /**
   * Add collaborator to note
   */
  addCollaborator(noteId: string, email: string): Observable<any> {
    return this.apiService.post<any>(`/notes/${noteId}/collaborators`, { email });
  }

  /**
   * Remove collaborator from note
   */
  removeCollaborator(noteId: string, collaboratorId: string): Observable<any> {
    return this.apiService.delete<any>(`/notes/${noteId}/collaborators/${collaboratorId}`);
  }
}
