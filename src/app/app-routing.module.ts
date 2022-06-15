import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'not-found', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupModule) },
  { path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule) },
  { 
    path: '**', 
    redirectTo: '/not-found' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
