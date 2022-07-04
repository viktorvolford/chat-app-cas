import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernamePipe } from '../pipes/username.pipe';
import { FullNamePipe } from '../pipes/full-name.pipe';



@NgModule({
  declarations: [
    UsernamePipe,
    FullNamePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsernamePipe,
    FullNamePipe
  ]
})
export class NameModule { }
