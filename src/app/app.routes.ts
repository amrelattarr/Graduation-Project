import { authGuard } from './core/guards/auth-guard';
import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';
import { Profile } from './core/auth/profile/profile';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout/auth-layout';
import { isLoggedGuard } from './core/guards/is-logged-guard';
import { CharityAdminLayout } from './core/layouts/charity-admin-layout/charity-admin-layout/charity-admin-layout';
import { DonorLayout } from './core/layouts/donor-layout/donor-layout/donor-layout';
import { VolanteerLayout } from './core/layouts/volanteer-layout/volanteer-layout/volanteer-layout';
import { AdminLayout } from './core/layouts/admin-layout/admin-layout/admin-layout';
import { roleGuard } from './core/guards/role-guard';
import { ChangePassword } from './core/auth/change-password/change-password';

export const routes: Routes = [
    {path: '' , redirectTo: 'login', pathMatch: 'full'},
    {path: '' , component: AuthLayout,canActivate:[isLoggedGuard] , children: [
        {path: 'login', component: Login , title: 'Login page'},
        {path: 'register', component: Register , title: 'Register page'},
    ]},
    {path: '' , component: CharityAdminLayout,canActivate:[authGuard, roleGuard], data: { roles: ['CharityAdmin'] } ,children: [
        
    ]},
    {path: '' , component: DonorLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Donor'] } , children: [
        {path: 'profile', component: Profile , title: 'Profile page'},
    ]},
    {path: '' , component: VolanteerLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Volunteer'] } , children: [
        {path: 'profile', component: Profile , title: 'Profile page'},
    ]},
    {path: '' , component: AdminLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Admin'] } , children: [

    ]},
    {path: 'change-password', component: ChangePassword ,canActivate:[authGuard, roleGuard], data: { roles: ['Donor','Volunteer','CharityAdmin'] } , title: 'Change password page'},
    {path: '**' , redirectTo: 'login', pathMatch: 'full'},


];
