import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import firebase from 'firebase/compat/app'; 
import { ReplaySubject, share } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keepAlive?: any;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
    ) {}

  public login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public loginWithGoogle(){
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider;
    return this.auth.signInWithPopup(googleAuthProvider);
  }

  public signup(form: FormGroup) : Promise<any> {
    const {email, password} = form.value; 
    return this.auth.createUserWithEmailAndPassword(email, password).then(cred => {
      this.userService.createUserFromForm(form, cred as any);
    }).catch(error => {
      console.log(error);
    });
  }

  public isUserLoggedIn(){
    return this.auth.user.pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  public logout(){
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  public startKeepAlive(){
    const user = localStorage.getItem('user');
    this.userService.updateTime(user as string, new Date().getTime());
    this.keepAlive = setInterval(() => {
      this.userService.updateTime(user as string, new Date().getTime());
    }, 60000);
  }

  public stopKeepAlive(){
    clearInterval(this.keepAlive);
  }
}
