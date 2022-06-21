import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const redirectLoggedInToDashboard = () => redirectLoggedInTo('main');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('login');

const routes: Routes = [
  { 
    path: 'not-found', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) 
  },
  { 
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  { 
    path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  { 
    path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { 
    path: 'create-room', loadChildren: () => import('./pages/create-room/create-room.module').then(m => m.CreateRoomModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { 
    path: '',
    redirectTo: 'main',
    pathMatch: 'full', 
  },
  { 
    path: '**', 
    redirectTo: 'not-found' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
