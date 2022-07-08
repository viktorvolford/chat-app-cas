import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, ReplaySubject, share } from 'rxjs';
import { Room } from '../models/Room';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  collectionName = 'Rooms';

  constructor(
    private afs: AngularFirestore
  ) { }

  create(room: Room) {
    return this.afs.collection<Room>(this.collectionName).add(room).then(res => {
      this.afs.collection<Room>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }

  getById(id: string) {
    return this.afs.collection<Room>(this.collectionName).doc(id).valueChanges().pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  getRooms(type: string){
    let rooms: Observable<Room[]>;

    if(type === 'public'){
      rooms = this.getPublicRooms();
    }
    else if(type === 'private'){
      const uid = localStorage.getItem('user') as string;
      rooms = this.getPrivateRooms(uid);
    }
    else{
      rooms = this.getProtectedRooms();
    }
    return rooms.pipe(
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    )
  }

  getPublicRooms() {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'public')).valueChanges();
  }

  getPrivateRooms(user_id: string) {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'private').where('members', 'array-contains', user_id)).valueChanges();
  }

  getProtectedRooms() {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'protected')).valueChanges();
  }

  update(room: Room) {
    return this.afs.collection<Room>(this.collectionName).doc(room.id).set(room);
  }

  delete(id: string) {
    return this.afs.collection<Room>(this.collectionName).doc(id).delete();
  }

  onSubmit(form: FormGroup, selectedUsers: Set<User>, chosenGroup: string): Promise<void>{
    return this.create({
      id: '',
      name: form.get('name')?.value as string,
      members: Array.from(selectedUsers).map(user => user.id),
      visibility: chosenGroup as string,
      owner_id: localStorage.getItem('user'),
      password: form.get('password')?.value as string,
    } as Room)
  }
}