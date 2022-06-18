import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  keepAlive?: any;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
    ) {}

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  isUserLoggedIn(){
    return this.auth.user;
  }

  logout(){
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  startKeepAlive(){
    this.keepAlive = setInterval(() => {
      console.log("Still logged in...");
      const user = localStorage.getItem('user')?.slice(1, -1);
      this.userService.updateTime(user as string, new Date().getTime());
    }, 2000);
  }

  stopKeepAlive(){
    clearInterval(this.keepAlive);
  }
}
