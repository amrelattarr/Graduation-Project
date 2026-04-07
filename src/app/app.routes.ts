import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';

export const routes: Routes = [
    {component: Login , path: 'login'},
    {component: Register , path: 'register'},
];
