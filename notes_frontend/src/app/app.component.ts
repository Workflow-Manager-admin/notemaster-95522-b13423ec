import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NotesService } from './services/notes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Notes App';
  backupInProgress = false;
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  constructor(private notesService: NotesService) {}

  backupNotes(): void {
    if (this.backupInProgress) return;
    
    this.backupInProgress = true;
    this.notesService.backupNotes().subscribe({
      next: () => {
        this.backupInProgress = false;
      },
      error: (error) => {
        console.error('Error backing up notes:', error);
        this.backupInProgress = false;
      }
    });
  }
}
