import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import firebase from 'firebase/compat/app'; 

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

  loginWithGoogle(){
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider;
    return this.auth.signInWithPopup(googleAuthProvider);
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
    const user = localStorage.getItem('user')?.slice(1, -1);
    this.userService.updateTime(user as string, new Date().getTime());
    this.keepAlive = setInterval(() => {
      this.userService.updateTime(user as string, new Date().getTime());
    }, 30000);
  }

  stopKeepAlive(){
    clearInterval(this.keepAlive);
  }
}
