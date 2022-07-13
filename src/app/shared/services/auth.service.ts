import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import firebase from 'firebase/compat/app'; 
import { ReplaySubject, share } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly userService: UserService,
    private readonly router: Router
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

  public logout() : void{
    this.auth.signOut().then(() => {
        this.router.navigateByUrl('/login');
    }).catch(error => {
      console.log(error);
    });
  }
}
