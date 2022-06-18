import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'drugstore-app';

  loggedInUser?: string;

  authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(){
    this.authService.isUserLoggedIn().subscribe({
      next: (user) => {
        if(user !== null) {
          this.loggedInUser = user?.uid;
          console.log(user);
          localStorage.setItem('user', JSON.stringify(this.loggedInUser));
          this.authService.startKeepAlive();
        }
    }, 
    error: (e) => {
      console.log(e);
      localStorage.removeItem('user');
      this.authService.stopKeepAlive();
    }});
  }

  onToggleSideNav(sidenav : MatSidenav){
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav){
    if (event === true){
      sidenav.close();
    }
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
