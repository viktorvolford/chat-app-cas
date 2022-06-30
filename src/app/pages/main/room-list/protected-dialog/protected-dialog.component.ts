import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-protected-dialog',
  templateUrl: './protected-dialog.component.html',
  styleUrls: ['./protected-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtectedDialogComponent implements OnInit {

  hide: boolean = true;

  enteredPassword: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {}

}
