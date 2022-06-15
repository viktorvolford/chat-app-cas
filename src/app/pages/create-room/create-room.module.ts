import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRoomRoutingModule } from './create-room-routing.module';
import { CreateRoomComponent } from './create-room.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateRoomComponent
  ],
  imports: [
    CommonModule,
    CreateRoomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ]
})
export class CreateRoomModule { }
