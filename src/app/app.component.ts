import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
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
    private authService: AuthService
  ){}

  ngOnInit(){
    this.authService.isUserLoggedIn().subscribe({
      next: (user) => {
      this.loggedInUser = user?.uid;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    }, 
    error: (e) => {
      console.log(e);
      localStorage.setItem('user', JSON.stringify(null));
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
      console.log('Logged out successfuly!');
    }).catch(error => {
      console.log(error);
    });
  }
}
