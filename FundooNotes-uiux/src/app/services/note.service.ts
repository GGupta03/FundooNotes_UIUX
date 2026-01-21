import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private apiService: ApiService) {}

  // Get all notes
  getAllNotes(): Observable<any> {
    return this.apiService.get('notes');
  }

  // Get note by ID
  getNoteById(id: number): Observable<any> {
    return this.apiService.get(`notes/${id}`);
  }

  // Create note
  createNote(note: { title: string; content: string }): Observable<any> {
    return this.apiService.post('notes', note);
  }

  // Update note
  updateNote(id: number, note: { title: string; content: string }): Observable<any> {
    return this.apiService.put(`notes/${id}`, note);
  }

  // Delete note
  deleteNote(id: number): Observable<any> {
    return this.apiService.delete(`notes/${id}`);
  }

  // Pin/Unpin note
  pinNote(id: number): Observable<any> {
    return this.apiService.patch(`notes/${id}/pin`, {});
  }

  // Archive note
  archiveNote(id: number): Observable<any> {
    return this.apiService.patch(`notes/${id}/archive`, {});
  }

  // Change note color
  changeNoteColor(id: number, color: string): Observable<any> {
    return this.apiService.patch(`notes/${id}/color`, { color });
  }

  // Search notes
  searchNotes(keyword: string): Observable<any> {
    return this.apiService.get(`notes/search?keyword=${keyword}`);
  }

  // Bulk delete
  bulkDeleteNotes(noteIds: number[]): Observable<any> {
    return this.apiService.delete('notes/bulk', { noteIds });
  }
}
