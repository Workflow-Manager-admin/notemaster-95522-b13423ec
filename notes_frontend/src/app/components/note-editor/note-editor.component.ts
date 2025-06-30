import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Note } from '../../models/note';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnInit {
  note: Partial<Note> = {
    title: '',
    content: ''
  };
  isNew = true;
  loading = false;
  error: string | null = null;
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (noteId && noteId !== 'new') {
      this.isNew = false;
      this.loadNote(parseInt(noteId, 10));
    }
  }

  loadNote(id: number): void {
    this.loading = true;
    this.notesService.getNote(id).subscribe({
      next: (note) => {
        this.note = note;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load note';
        this.loading = false;
        console.error('Error loading note:', err);
      }
    });
  }

  saveNote(): void {
    if (!this.note.title?.trim() || !this.note.content?.trim()) {
      this.error = 'Title and content are required';
      return;
    }

    this.loading = true;
    this.error = null;

    const saveOperation = this.isNew
      ? this.notesService.createNote(this.note as Omit<Note, 'id' | 'created_at' | 'updated_at'>)
      : this.notesService.updateNote(this.note.id!, this.note);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        this.error = 'Failed to save note';
        this.loading = false;
        console.error('Error saving note:', err);
      }
    });
  }
}
