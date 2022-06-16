import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationRoutingModule } from './conversation-routing.module';
import { ConversationComponent } from './conversation.component';


@NgModule({
  declarations: [
    ConversationComponent,
  ],
  imports: [
    CommonModule,
    ConversationRoutingModule
  ]
})
export class ConversationModule { }
