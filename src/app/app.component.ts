import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { SessionService } from './shared/services/session.service';
import { select, Store } from '@ngrx/store';
import { AppState } from './store/models/app.state';
import { login, logout } from './store/actions/user-session.actions';
import { selectUserSession } from './store/selectors/user-session.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  private sessionSubscription: Subscription;

  public selectedLang: string = '';

  public loggedInUser$: Observable<string>;

  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly store: Store<AppState>,
    public readonly translate: TranslateService
  ){
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang() as string;
    translate.use(browserLang.match(/en|hu/) ? browserLang : 'en');

    this.sessionSubscription = this.authService.isUserLoggedIn().subscribe({
      next: (user) => {
        if(user?.uid)
        {
          this.store.dispatch(login({id: user?.uid as string}));
        } else {
          this.store.dispatch(logout());
        }
        this.sessionService.setUser(user?.uid as string);
      }, 
      error: (e) => {
        console.log(e);
      }
    });

    this.loggedInUser$ = this.store.pipe(select(selectUserSession));
  }

  ngOnInit() : void {
    this.selectedLang = this.translate.currentLang; 
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();
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
