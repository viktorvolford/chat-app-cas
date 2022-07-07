import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

  chosenVisibility: string = 'public';

  constructor() { }

  ngOnInit(): void {
  }

  onToggleChange(value: string): void {
    this.chosenVisibility = value;
  }

}
