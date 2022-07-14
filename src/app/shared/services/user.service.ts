import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { debounceTime, distinctUntilChanged, map, Observable, ReplaySubject, share, startWith, switchMap, take, tap } from 'rxjs';
import { User } from '../models/User';
import { AbstractControl, FormGroup } from '@angular/forms';
import { UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { loadUsers } from '../../store/actions/users.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/models/app.state';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private collectionName = 'Users';

  public users$: Observable<User[]>;

  constructor(
    private readonly afs: AngularFirestore,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly store: Store<AppState>
    ) {
    this.users$ = this.getAll().pipe(
      tap(users => this.store.dispatch(loadUsers({users}))),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
  }

  public create(user: User) : Promise<void> {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  public updateTime(id: string, date: number) : void {
    this.afs.collection<User>(this.collectionName).doc(id).update({last_active: date});
  }

  public getFilteredUsernames(field: AbstractControl): Observable<string[]>{
    return field.valueChanges.pipe(
      startWith(null),
      debounceTime(500),
      switchMap((searchValue: string | null) => searchValue ? this._filter(searchValue) : this.users$.pipe(
        map(users => users.map(user => user.username)),
      )),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
  }

  //For Google login method
  public createNonExistingUser(cred: UserCredential): void {
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
      this.router.navigateByUrl('/main');
    });
  }

  public createUserFromForm(form: FormGroup, cred: UserCredential): void {
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

  private getAll() : Observable<User[]> {
    return this.afs.collection<User>(this.collectionName).valueChanges().pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  private getById(id: string) : Observable<User | undefined> {
    return this.afs.collection<User>(this.collectionName).doc(id).valueChanges().pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  private createUser(user: User): void {
    this.create(user).then(_ => {
      this.toast.createSnackBar('LOGIN_REGISTER.CREATED', 'COMMON.GREAT');
      this.router.navigateByUrl('/main');
    }).catch(error => {
      console.log(error);
    });
  }

  private _filter(searchValue: string): Observable<string[]> {
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
  
}
