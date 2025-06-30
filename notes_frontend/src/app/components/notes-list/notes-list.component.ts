import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Note } from '../../models/note';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  loading = false;
  error: string | null = null;
  deleteConfirmation: number | null = null;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.error = null;
    
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notes. Please try again.';
        this.loading = false;
        console.error('Error loading notes:', err);
      }
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmation = id;
  }

  cancelDelete(): void {
    this.deleteConfirmation = null;
  }

  deleteNote(id: number): void {
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        this.deleteConfirmation = null;
      },
      error: (err) => {
        console.error('Error deleting note:', err);
        this.error = 'Failed to delete note. Please try again.';
      }
    });
  }
}
