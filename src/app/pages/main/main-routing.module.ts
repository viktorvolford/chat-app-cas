import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  { 
    path: '', component: MainComponent 
  }, 
  { 
    path: 'conversation', loadChildren: () => import('./conversation/conversation.module').then(m => m.ConversationModule) 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
