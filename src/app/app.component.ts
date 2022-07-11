import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public selectedLang: string = '';

  public loggedInUser: Observable<string>;

  constructor(
    private readonly authService: AuthService,
    public readonly translate: TranslateService
  ){
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang() as string;
    translate.use(browserLang.match(/en|hu/) ? browserLang : 'en');

    this.loggedInUser = this.authService.loggedInUser$;
  }

  ngOnInit() : void {
    this.selectedLang = this.translate.currentLang;
    
  }

  public onToggleSideNav(sidenav : MatSidenav) : void {
    sidenav.toggle();
  }

  public onClose(event: any, sidenav: MatSidenav) : void {
    if (event === true){
      sidenav.close();
    }
  }

  public switchLanguage(value: string) : void{
    this.selectedLang = value;
    this.translate.use(value);
  }

  public logout(_?: boolean) : void{
    this.authService.logout();
  }
}
