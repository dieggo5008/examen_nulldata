import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component'

const AppRoutes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const AppRouting = RouterModule.forRoot(AppRoutes, { useHash: true });