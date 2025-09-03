import { Routes } from '@angular/router';
import {Landing} from './features/auth/landing/landing';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';

export const routes: Routes = [
  {path: '', component: Landing},
  {path: 'login', component: Login},
  {path: 'register', component: Register}
];
