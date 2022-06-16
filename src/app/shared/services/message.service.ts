import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  collectionName = 'Messages';

  constructor(private afs: AngularFirestore) { }

  create(message: Message) {
    return this.afs.collection<Message>(this.collectionName).add(message).then(res => {
      this.afs.collection<Message>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }

  getMessagesforRoom(id: string) {
    return this.afs.collection<Message>(this.collectionName, ref => ref
      .where('type', '==', 'room')
      .where('target_id', '==', id)
      .orderBy('date', 'asc'))
      .valueChanges();
  }

  getPersonalMessages(firstId: string, secondId: string) {
    return this.afs.collection<Message>(this.collectionName, ref => ref
      .where('type', '==', 'personal')
      .where('sender_id', 'in', [firstId, secondId])
      .where('target_id', 'in', [firstId, secondId])
      .orderBy('date', 'asc'))
      .valueChanges();
  }

  getById(id: string) {
    return this.afs.collection<Message>(this.collectionName).doc(id).valueChanges();
  }

  update(message: Message) {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }

  delete(id: string) {
    return this.afs.collection<Message>(this.collectionName).doc(id).delete();
  }
}
