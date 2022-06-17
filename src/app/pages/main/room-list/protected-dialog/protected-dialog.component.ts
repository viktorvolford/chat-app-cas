import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomListComponent } from '../room-list.component';

@Component({
  selector: 'app-protected-dialog',
  templateUrl: './protected-dialog.component.html',
  styleUrls: ['./protected-dialog.component.scss']
})
export class ProtectedDialogComponent implements OnInit {

  hide: boolean = true;

  enteredPassword: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {}

}
