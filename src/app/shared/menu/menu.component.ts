import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {

  @Output() onCloseSidenav : EventEmitter<boolean> = new EventEmitter();
  @Output() onSwitchLanguage : EventEmitter<string> = new EventEmitter();
  @Output() onLogout : EventEmitter<boolean> = new EventEmitter();
  @Input() loggedInUser?: string;

  @Input() selectedLang: string = '';

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedLang = this.translate.currentLang;
  }

  switchLanguage(value: string) {
    this.onSwitchLanguage.emit(value);
  }

  close(logout?: boolean){
    if(logout === true){
      this.onLogout.emit(logout);
    }
    this.onCloseSidenav.emit(true);
  }
}
