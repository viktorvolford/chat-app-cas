import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  chosenVisibility: string = 'public';

  constructor(
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
  }

  onToggleChange(value: string): void {
    this.chosenVisibility = value;
  }

}
