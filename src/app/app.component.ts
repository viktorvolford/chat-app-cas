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

  public selectedLang: string = '';

  public loggedInUser?: string;

  private authSubscription: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    public readonly translate: TranslateService
  ){
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang() as string;
    translate.use(browserLang.match(/en|hu/) ? browserLang : 'en');

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
      }
    });
  }

  ngOnInit() : void {
    this.selectedLang = this.translate.currentLang;
    
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
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
