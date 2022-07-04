import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernamePipe } from '../pipes/username.pipe';
import { FullNamePipe } from '../pipes/full-name.pipe';
import { RoomNamePipe } from '../pipes/room-name.pipe';



@NgModule({
  declarations: [
    UsernamePipe,
    FullNamePipe,
    RoomNamePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsernamePipe,
    FullNamePipe,
    RoomNamePipe
  ]
})
export class NameModule { }
