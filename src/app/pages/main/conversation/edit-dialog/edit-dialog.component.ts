import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  editedText?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.editedText = this.data.message.content;
  }

}
