import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/productos/producto-list.component').then((m) => m.ProductoListComponent)
  },
  {
    path: 'productos/nuevo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/productos/producto-form.component').then((m) => m.ProductoFormComponent)
  },
  {
    path: 'productos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./features/productos/producto-form.component').then((m) => m.ProductoFormComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'productos' },
  { path: '**', redirectTo: 'productos' }
];