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
import { Charties } from './features/admin/components/charties/charties';
import { CharityAdminHome } from './features/charity-admin/components/charity-admin-home/charity-admin-home';
import { VolunteerHome } from './features/volanteer/components/volunteer-home/volunteer-home';
import { MyVolunteers } from './features/charity-admin/components/my-volunteers/my-volunteers';
import { MyProfile } from './shared/components/my-profile/my-profile';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { DonorHome } from './features/donor/components/donor-home/donor-home';
import { CreateDonation } from './features/donor/components/create-donation/create-donation';
import { MyDonations } from './features/donor/components/my-donations/my-donations';
import { DonationDetails } from './features/donor/components/donation-details/donation-details';
import { EditDonation } from './features/donor/components/edit-donation/edit-donation';
import { CharityDonations } from './features/charity-admin/components/charity-donations/charity-donations';
import { PickupTasks } from './features/charity-admin/components/pickup-tasks/pickup-tasks';
import { Notifications } from './features/notifications/notifications';
import { VolunteerPickupTasks } from './features/volanteer/components/volunteer-pickup-tasks/volunteer-pickup-tasks';

export const routes: Routes = [
    {path: '' , redirectTo: 'login', pathMatch: 'full'},
    {path: '' , component: AuthLayout,canActivate:[isLoggedGuard] , children: [
        {path: 'login', component: Login , title: 'Login page'},
        {path: 'register', component: Register , title: 'Register page'},
    ]},
    {path: '' , component: CharityAdminLayout,canActivate:[authGuard, roleGuard], data: { roles: ['CharityAdmin'] } ,children: [
        {path: 'charity-admin-home', component:CharityAdminHome , title: 'Charity admin home page'},
        {path: 'my-volunteers' , component: MyVolunteers , title: 'My volunteers page'},
        { path: 'charity-donations', component: CharityDonations, title: 'Charity Donations' },
        { path: 'pickup-tasks', component: PickupTasks, title: 'Pickup Tasks' },
        
    ]},
    {path: 'donor' , component: DonorLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Donor'] } , children: [
        { path: 'home', component: DonorHome, title: 'Donor Home' },
        {path: 'create-donation',component: CreateDonation,title: 'Create Donation',},
        { path: 'my-donations', component: MyDonations, title: 'My Donations' },
        {path: 'donation-details/:id',component: DonationDetails,title: 'Donation Details',},
        { path: 'edit-donation/:id', component: EditDonation, title: 'Edit Donation' },
        { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]},
    {path: '' , component: VolanteerLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Volunteer'] } , children: [
        {path: 'volunteer-home', component: VolunteerHome , title: 'Volunteer home page'},
        { path: 'volunteer-pickup-tasks', component: VolunteerPickupTasks, title: 'Volunteer Pickup Tasks' },
    ]},
    {path: '' , component: AdminLayout,canActivate:[authGuard, roleGuard], data: { roles: ['Admin'] } , children: [
        {path: 'charties' , component: Charties , title: 'Charties page'},

    ]},
    {path: 'change-password', component: ChangePassword ,canActivate:[authGuard, roleGuard], data: { roles: ['Donor','Volunteer','CharityAdmin'] } , title: 'Change password page'},
    {path: 'my-profile', component: MyProfile ,canActivate:[authGuard, roleGuard], data: { roles: ['Donor','Volunteer','CharityAdmin'] } , title: 'my Profile page'},
    {path: 'profile', component: Profile ,canActivate:[authGuard, roleGuard], data: { roles: ['Donor','Volunteer'] } , title: 'complete Profile page'},
    {path: 'dashboard', component: Dashboard ,canActivate:[authGuard, roleGuard], data: { roles: ['Admin','CharityAdmin'] } , title: 'Dashboard page'},
     {path: 'notifications',component: Notifications, canActivate: [authGuard],title: 'Notifications'},
    {path: '**' , redirectTo: 'login', pathMatch: 'full'},
   
    
    
    // {path: 'profile', component: Profile ,canActivate:[authGuard, roleGuard], data: { roles: ['Donor','Volunteer'] } , title: 'Profile page'},


];
