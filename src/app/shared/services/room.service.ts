import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room } from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  collectionName = 'Rooms';

  constructor(
    private afs: AngularFirestore
  ) { }

  create(room: Room) {
    return this.afs.collection<Room>(this.collectionName).doc(room.id).set(room);
  }

  getById(id: string) {
    return this.afs.collection<Room>(this.collectionName).doc(id).valueChanges();
  }

  getRooms(type: string){
    if(type === 'public'){
      return this.getPublicRooms();
    }
    else if(type === 'private'){
      return;//return this.getPrivateRooms();
    }
    else{
      return this.getProtectedRooms();
    }
  }

  getPublicRooms() {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'public')).valueChanges();
  }

  getPrivateRooms(user_id: string) {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'private').where('access', 'array-contains', user_id)).valueChanges();
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
}