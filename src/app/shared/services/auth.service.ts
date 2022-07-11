import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import firebase from 'firebase/compat/app'; 
import { BehaviorSubject, ReplaySubject, share } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keepAlive?: any;

  public loggedInUser$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly userService: UserService,
    private readonly router: Router
    ) {
      this.isUserLoggedIn().subscribe({
        next: (user) => {
          if(user !== null) {
            console.log(user?.uid);
            this.loggedInUser$.next(user?.uid);
            localStorage.setItem('user', JSON.stringify(user?.uid).slice(1, -1));
            this.startKeepAlive();
          }
        }, 
        error: (e) => {
          console.log(e);
          localStorage.removeItem('user');
          this.stopKeepAlive();
        }
      });
    }

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

  public logout() : void{
    this.auth.signOut().then(() => {
        localStorage.removeItem('user');
        this.loggedInUser$.next('');
        this.router.navigateByUrl('/login');
        this.stopKeepAlive();
    }).catch(error => {
      console.log(error);
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
