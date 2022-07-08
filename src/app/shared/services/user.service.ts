import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { debounceTime, map, Observable, ReplaySubject, share, startWith, switchMap } from 'rxjs';
import { User } from '../models/User';
import { AbstractControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = 'Users';

  users$: Observable<User[]>;

  constructor(private afs: AngularFirestore) {
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
}
