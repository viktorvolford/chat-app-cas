import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoomListComponent } from './convo-list/room-list.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    MainComponent,
    RoomListComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatButtonToggleModule,
    MatCardModule
  ]
})
export class MainModule { }
