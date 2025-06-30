import { Routes } from '@angular/router';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { NoteSearchComponent } from './components/note-search/note-search.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/notes', 
    pathMatch: 'full' 
  },
  { 
    path: 'notes', 
    component: NotesListComponent,
    data: { prerender: false }  // Disable prerendering for authenticated route
  },
  { 
    path: 'notes/new', 
    component: NoteEditorComponent,
    data: { prerender: false }  // Disable prerendering for authenticated route
  },
  { 
    path: 'notes/:id', 
    component: NoteEditorComponent,
    data: { prerender: false }  // Disable prerendering for authenticated route
  },
  { 
    path: 'search', 
    component: NoteSearchComponent,
    data: { prerender: false }  // Disable prerendering for authenticated route
  }
];
