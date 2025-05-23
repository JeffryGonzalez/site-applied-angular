import { Routes } from '@angular/router';
import { HomeComponent } from './home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'ephemeral-user',
    loadChildren: () =>
      import('../ephemeral-user/routes').then((m) => m.EPHEMERAL_USER_ROUTES),
  },
  {
    path: 'anti-patterns',
    loadChildren: () =>
      import('../anti-patterns/routes').then((m) => m.ANTI_PATTERN_ROUTES),
  },

  {
    path: 'outbox',
    loadChildren: () =>
      import('../outbox2/routes').then((m) => m.OUTBOX_TWO_ROUTES),
  },
];
