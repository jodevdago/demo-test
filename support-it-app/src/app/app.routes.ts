import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './layouts/unauthorized/unauthorized.component';
import { UsersComponent } from './views/users/users.component';

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
        path: 'users',
        loadComponent: () => import('./views/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: '',
        loadComponent: () => import('./views/users/users.component').then(m => m.UsersComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
]
