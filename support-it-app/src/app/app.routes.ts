import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './layouts/unauthorized/unauthorized.component';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./views/tickets/tickets.component').then(m => m.TicketsComponent),
      },
      {
        path: 'tickets',
        loadComponent: () => import('./views/tickets/tickets.component').then(m => m.TicketsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./views/users/users.component').then(m => m.UsersComponent),
        canActivate: [userGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
]
