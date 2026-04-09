import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';
import { Profile } from './core/auth/profile/profile';

export const routes: Routes = [

// { path: '', redirectTo: 'login', pathMatch: 'full' },
    {component: Login , path: 'login'},
    {component: Register , path: 'register'},
    { component: Profile ,path: 'profile' },
    //  { path: '**', redirectTo: 'login' }

];
