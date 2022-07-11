import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../models/Message';
import { combineLatest, map, of, ReplaySubject, share, switchMap, take } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../pages/main/conversation/edit-dialog/edit-dialog.component';
import { ToastService } from './toast.service';

@Injectable()
export class MessageService {

  private collectionName = 'Messages';

  constructor(
    private readonly afs: AngularFirestore,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService
    ) { }

  public getMessagesforRoom(id: string) {
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

  public getPersonalMessages(firstId: string, secondId: string) {
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

  public delete(id: string) : void {
    this.afs.collection<Message>(this.collectionName).doc(id).delete().then(_ => {
      this.toast.createSnackBar('CONVERSATION.DELETED', 'COMMON.OK');
    });
  }

  public sendMessage(form: FormGroup){
    if (form.get('content')?.value) {
      form.get('date')?.setValue(new Date().getTime());

      this.create(form.value as Message).then(_ => {
        form.get('content')?.setValue('');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  public openEditDialog(message: Message){
    const dialogRef = this.dialog.open(EditDialogComponent, {data: {message}});

    dialogRef.afterClosed().subscribe(result => {
      if(result && result !== message.content){
        message.content = result; 
        this.update(message).then(() => {
          this.toast.createSnackBar('CONVERSATION.MODIFIED', 'COMMON.OK');
        });
      } else if(result === ''){
        this.toast.createSnackBar('CONVERSATION.EMPTY', 'COMMON.OK');
      }
    });
  }

  private create(message: Message) {
    return this.afs.collection<Message>(this.collectionName).add(message).then(res => {
      this.afs.collection<Message>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }

  private update(message: Message) {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }
}
