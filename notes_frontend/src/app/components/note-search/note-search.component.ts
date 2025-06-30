import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Note } from '../../models/note';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './note-search.component.html',
  styleUrls: ['./note-search.component.css']
})
export class NoteSearchComponent {
  searchQuery = '';
  searchResults: Note[] = [];
  loading = false;
  error: string | null = null;
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  constructor(private notesService: NotesService) {}

  search(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.loading = true;
    this.error = null;

    this.notesService.searchNotes(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to search notes';
        this.loading = false;
        console.error('Error searching notes:', err);
      }
    });
  }
}
