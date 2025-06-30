import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Note } from '../models/note';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private platformId = inject(PLATFORM_ID);

  constructor(private supabaseService: SupabaseService) {}

  private handleSSR<T>(fallback: T): Observable<T> {
    return isPlatformBrowser(this.platformId) ? 
      throwError(() => new Error('User not authenticated')) : 
      of(fallback);
  }

  getNotes(): Observable<Note[]> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      switchMap(user => {
        if (!user) return this.handleSSR<Note[]>([]);
        return from(this.supabaseService.getNotes(user.id)).pipe(
          map(result => result as Note[])
        );
      }),
      catchError(error => {
        if (!isPlatformBrowser(this.platformId)) return of([]);
        console.error('Error fetching notes:', error);
        return throwError(() => new Error('Failed to fetch notes'));
      })
    );
  }

  getNote(id: number): Observable<Note> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.getNote(id, user.id)).pipe(
          map(result => result as Note)
        );
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
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.createNote({
          title: note.title,
          content: note.content,
          user_id: user.id
        })).pipe(
          map(result => result as Note)
        );
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
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.updateNote(id, {
          title: note.title!,
          content: note.content!,
          user_id: user.id
        })).pipe(
          map(result => result as Note)
        );
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
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.deleteNote(id, user.id));
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
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.searchNotes(query, user.id)).pipe(
          map(result => result as Note[])
        );
      }),
      catchError(error => {
        console.error('Error searching notes:', error);
        return throwError(() => new Error('Failed to search notes'));
      })
    );
  }

  // PUBLIC_INTERFACE
  backupNotes(): Observable<void> {
    return this.supabaseService.getCurrentUser().pipe(
      map(response => response.data.user),
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabaseService.backupNotes(user.id));
      }),
      catchError(error => {
        console.error('Error backing up notes:', error);
        return throwError(() => new Error('Failed to backup notes'));
      })
    );
  }
}
