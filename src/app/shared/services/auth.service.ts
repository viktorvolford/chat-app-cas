import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  keepAlive?: any;

  constructor(private auth: AngularFireAuth) {}

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
    this.keepAlive = setInterval(() => console.log("Still logged in..."), 2000);
  }

  stopKeepAlive(){
    clearInterval(this.keepAlive);
  }
}
