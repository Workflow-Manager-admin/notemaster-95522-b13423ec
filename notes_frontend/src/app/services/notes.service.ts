import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';
import { environment } from '../../environments/environment';

/**
 * Service for handling note-related operations with the backend API
 */
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = environment.apiUrl + '/notes';

  constructor(
    /* eslint-disable-next-line no-unused-vars */
    private http: HttpClient
  ) {}

  /**
   * Retrieves all notes for the current user
   * @returns Observable<Note[]> List of notes
   */
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  /**
   * Retrieves a specific note by ID
   * @param id The ID of the note to retrieve
   * @returns Observable<Note> The requested note
   */
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new note
   * @param note The note data to create
   * @returns Observable<Note> The created note
   */
  createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  /**
   * Updates an existing note
   * @param id The ID of the note to update
   * @param note The updated note data
   * @returns Observable<Note> The updated note
   */
  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  /**
   * Deletes a note
   * @param id The ID of the note to delete
   * @returns Observable<void>
   */
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Searches notes based on a query string
   * @param query The search query
   * @returns Observable<Note[]> List of matching notes
   */
  searchNotes(query: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
