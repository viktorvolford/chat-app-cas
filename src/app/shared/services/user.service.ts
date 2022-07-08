import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { debounceTime, map, Observable, ReplaySubject, share, startWith, switchMap, take } from 'rxjs';
import { User } from '../models/User';
import { AbstractControl, FormGroup } from '@angular/forms';
import { UserCredential } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = 'Users';

  users$: Observable<User[]>;

  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
    ) {
    this.users$ = this.getAll();
  }

  create(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  getAll() {
    return this.afs.collection<User>(this.collectionName).valueChanges().pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  getById(id: string) {
    return this.afs.collection<User>(this.collectionName).doc(id).valueChanges().pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  update(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  updateTime(id: string, date: number){
    this.afs.collection<User>(this.collectionName).doc(id).update({last_active: date});
  }

  delete(id: string) {
    return this.afs.collection<User>(this.collectionName).doc(id).delete();
  }

  getFilteredUsernames(field: AbstractControl<any>): Observable<string[]>{
    return field.valueChanges.pipe(
      startWith(null),
      debounceTime(500),
      switchMap((searchValue: string | null) => searchValue ? this._filter(searchValue) : this.users$.pipe(
        map(users => users.map(user => user.username)),
      )),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  _filter(searchValue: string): Observable<string[]> {
    const filterValue = searchValue.toLowerCase();

    return this.users$.pipe(
      map(users => users
        .map(user => user.username)
        .filter(username => username.toLowerCase().includes(filterValue))
      ),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: true
      })
    )
  }

  //For Google login method
  createNonExistingUser(cred: UserCredential){
    this.getById(cred.user.uid).pipe(take(1)).subscribe(data => {
      if(!data){
        const user : User = {
            id: cred.user?.uid as string,
            email: cred.user.email as string,
            username: cred.user.displayName as string,
            name: {
              firstname: cred.user.displayName?.split(' ')[0] as string,
              lastname: cred.user.displayName?.split(' ')[1] as string
            },
            last_active: new Date().getTime()
        };  
        this.createUser(user);
      }
    });
  }

  createUserFromForm(form: FormGroup<any>, cred: UserCredential) {
    const user : User = {
      id: cred.user?.uid as string,
      email: form.get('email')?.value as string,
      username: form.get('username')?.value as string,
      name: {
        firstname: form.get('name.firstname')?.value,
        lastname: form.get('name.lastname')?.value
      },
      last_active: new Date().getTime()
    };
    this.createUser(user);
  }

  createUser(user: User) {
    this.create(user).then(_ => {
      this.snackBar.open(
        this.translate.instant('LOGIN_REGISTER.CREATED'), 
        this.translate.instant('COMMON.GREAT'),
        {duration: 2000});
      this.router.navigateByUrl('/main');
    }).catch(error => {
      console.log(error);
    });
  }
  
}
