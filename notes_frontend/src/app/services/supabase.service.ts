import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // Authentication methods
  signUp(email: string, password: string): Observable<any> {
    return from(this.supabase.auth.signUp({ email, password }));
  }

  signIn(email: string, password: string): Observable<any> {
    return from(this.supabase.auth.signInWithPassword({ email, password }));
  }

  signOut(): Observable<any> {
    return from(this.supabase.auth.signOut());
  }

  getCurrentUser(): Observable<any> {
    return from(this.supabase.auth.getUser());
  }

  // Notes methods
  async getNotes(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getNote(id: number, userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async createNote(note: { title: string; content: string; user_id: string }): Promise<any> {
    const { data, error } = await this.supabase
      .from('notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNote(id: number, note: { title: string; content: string; user_id: string }): Promise<any> {
    const { data, error } = await this.supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .eq('user_id', note.user_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteNote(id: number, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async searchNotes(query: string, userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  private platformId = inject(PLATFORM_ID);

  async backupNotes(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (isPlatformBrowser(this.platformId)) {
      const backupData = JSON.stringify(data, null, 2);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download using the injected document
      const link = this.document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      this.document.body.appendChild(link);
      link.click();
      this.document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
  }
}
