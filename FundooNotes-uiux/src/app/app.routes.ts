import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { NotesComponent } from './pages/notes/notes.component';
import { RemindersComponent } from './pages/reminders/reminders.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { TrashComponent } from './pages/trash/trash.component';
import { EditLabelsComponent } from './pages/edit-labels/edit-labels.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'notes', pathMatch: 'full' },
      { path: 'notes', component: NotesComponent },
      { path: 'reminders', component: RemindersComponent },
      { path: 'archive', component: ArchiveComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'edit-labels', component: EditLabelsComponent },
    ],
  },

  { path: '**', redirectTo: 'login' }
];
