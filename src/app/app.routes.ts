import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';
import { ForgetPassword } from './core/auth/forget-password/forget-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {component: Login , path: 'login'},
  {component: Register , path: 'register'},
  {component: ForgetPassword , path: 'forget-password'},
];
