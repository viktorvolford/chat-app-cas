import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

  public chosenVisibility: string = 'public';

  constructor() { }

  ngOnInit(): void {
  }

  public onToggleChange(value: string): void {
    this.chosenVisibility = value;
  }

}
