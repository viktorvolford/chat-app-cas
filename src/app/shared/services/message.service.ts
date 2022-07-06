import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../models/Message';
import { combineLatest, map, of, ReplaySubject, share, switchMap } from 'rxjs';

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
      .valueChanges().pipe(
        share({
          connector: () => new ReplaySubject(1),
          resetOnRefCountZero: false
        })
      );
  }

  getPersonalMessages(firstId: string, secondId: string) {
     const first = this.afs.collection<Message>(this.collectionName, ref => ref
        .where('type', '==', 'personal')
        .where('sender_id', '==', firstId)
        .where('target_id', '==', secondId)
        .orderBy('date', 'asc'))
        .valueChanges();
      if(firstId === secondId){
        return first;
      }
      const second = this.afs.collection<Message>(this.collectionName, ref => ref
        .where('type', '==', 'personal')
        .where('sender_id', '==', secondId)
        .where('target_id', '==', firstId)
        .orderBy('date', 'asc'))
        .valueChanges();

      return combineLatest([first, second]).pipe(
        switchMap(messages => {
          const [firstMes, secondMes] = messages;
          const combined = firstMes.concat(secondMes);
          return of(combined);
        }),
        map(messages => messages.sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0)),
        share({
          connector: () => new ReplaySubject(1),
          resetOnRefCountZero: false
        })
      );
  }

  update(message: Message) {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }

  delete(id: string) {
    return this.afs.collection<Message>(this.collectionName).doc(id).delete();
  }
}
