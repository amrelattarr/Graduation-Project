import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';
import { Profile } from './core/auth/profile/profile';
import { Home } from './features/charity-admin/home/home';
import { charityAdminRoleGuard } from './core/auth/guards/charity-admin-role.guard';

export const routes: Routes = [

  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth pages
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },

  // Charity admin routes
  {
    path: 'charity-admin',
    canActivate: [charityAdminRoleGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'details', loadComponent: () => import('./features/charity-admin/details/details').then(m => m.Details) },
      // Placeholder routes
      { path: 'add-charity', redirectTo: 'home' },
      { path: 'requests', redirectTo: 'details' }
    ]
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];

