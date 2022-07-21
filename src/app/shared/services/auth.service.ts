import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; 
import { Observable, ReplaySubject, share } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly userService: UserService,
    private readonly router: Router
    ) {}

  public loginWithEmailPassword(email: string, password: string) : Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public loginWithGoogle() : Promise<any> {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider;
    return this.auth.signInWithPopup(googleAuthProvider);
  }

  public signup(user: User, password: string) : Promise<any> {
    return this.auth.createUserWithEmailAndPassword(user.email, password).then(cred => {
      this.userService.createUserWithCred(user, cred as any);
    }).catch(error => {
      console.log(error);
    });
  }

  public isUserLoggedIn() : Observable<firebase.User | null>{
    return this.auth.user.pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  public logout() : Promise<void> {
    return this.auth.signOut();
  }
}
