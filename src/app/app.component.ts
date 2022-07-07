import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'drugstore-app';
  selectedLang: string = '';

  loggedInUser?: string;

  authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ){
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang() as string;
    translate.use(browserLang.match(/en|hu/) ? browserLang : 'en');
  }

  ngOnInit(){
    this.selectedLang = this.translate.currentLang;
    this.authSubscription = this.authService.isUserLoggedIn().subscribe({
      next: (user) => {
        if(user !== null) {
          this.loggedInUser = user?.uid;
          localStorage.setItem('user', JSON.stringify(this.loggedInUser).slice(1, -1));
          this.authService.startKeepAlive();
        }
    }, 
    error: (e) => {
      console.log(e);
      localStorage.removeItem('user');
      this.authService.stopKeepAlive();
    }});
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  onToggleSideNav(sidenav : MatSidenav){
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav){
    if (event === true){
      sidenav.close();
    }
  }

  switchLanguage(value: string){
    this.selectedLang = value;
    this.translate.use(value);
  }

  logout(_?: boolean){
    this.authService.logout().then(() => {
      this.loggedInUser = '';
      this.router.navigateByUrl('/login');
      console.log('Logged out successfuly!');
      this.authService.stopKeepAlive();
    }).catch(error => {
      console.log(error);
    });
  }
}
