import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { SessionService } from './shared/services/session.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/models/app.state';
import { logout } from './store/actions/user-session.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  private sessionSubscription: Subscription;
  
  public selectedLang: string;
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
        this.sessionService.setUser(user?.uid as string);
      }, 
      error: (e) => {
        console.log(e);
      }
    });

    this.loggedInUser$ = this.sessionService.user$;
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

  public logout() : void{
    this.store.dispatch(logout());
  }
}
