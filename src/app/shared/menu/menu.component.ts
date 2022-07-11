import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {

  @Input() loggedInUser?: string;
  @Input() selectedLang: string = '';

  @Output() onCloseSidenav : EventEmitter<boolean> = new EventEmitter();
  @Output() onSwitchLanguage : EventEmitter<string> = new EventEmitter();
  @Output() onLogout : EventEmitter<any> = new EventEmitter();

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
      this.onLogout.emit();
    }
    this.onCloseSidenav.emit(true);
  }
}
