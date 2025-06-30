import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Note } from '../models/note';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private supabaseService: SupabaseService) {}

  getNotes(): Observable<Note[]> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return user.id;
      }),
      map(userId => this.supabaseService.getNotes(userId)),
      catchError(error => {
        console.error('Error fetching notes:', error);
        return throwError(() => new Error('Failed to fetch notes'));
      })
    );
  }

  getNote(id: number): Observable<Note> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return this.supabaseService.getNote(id, user.id);
      }),
      catchError(error => {
        console.error('Error fetching note:', error);
        return throwError(() => new Error('Failed to fetch note'));
      })
    );
  }

  createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Observable<Note> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return this.supabaseService.createNote({
          title: note.title,
          content: note.content,
          user_id: user.id
        });
      }),
      catchError(error => {
        console.error('Error creating note:', error);
        return throwError(() => new Error('Failed to create note'));
      })
    );
  }

  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return this.supabaseService.updateNote(id, {
          title: note.title!,
          content: note.content!,
          user_id: user.id
        });
      }),
      catchError(error => {
        console.error('Error updating note:', error);
        return throwError(() => new Error('Failed to update note'));
      })
    );
  }

  deleteNote(id: number): Observable<void> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return this.supabaseService.deleteNote(id, user.id);
      }),
      catchError(error => {
        console.error('Error deleting note:', error);
        return throwError(() => new Error('Failed to delete note'));
      })
    );
  }

  searchNotes(query: string): Observable<Note[]> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return this.supabaseService.searchNotes(query, user.id);
      }),
      catchError(error => {
        console.error('Error searching notes:', error);
        return throwError(() => new Error('Failed to search notes'));
      })
    );
  }
}
