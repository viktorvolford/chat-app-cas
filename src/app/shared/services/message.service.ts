import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../models/Message';
import { combineLatest, map, of, ReplaySubject, share, switchMap, take } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../pages/main/conversation/edit-dialog/edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MessageService {

  collectionName = 'Messages';

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
    ) { }

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

  sendMessage(form: FormGroup){
    if (form.get('content')?.value) {
      form.get('date')?.setValue(new Date().getTime());

      this.create(form.value as Message).then(_ => {
        form.get('content')?.setValue('');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  openEditDialog(message: Message){
    const dialogRef = this.dialog.open(EditDialogComponent, {data: {message}});

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if(result && result !== message.content){
        message.content = result; 
        this.update(message).then(() => {
          this.snackBar.open(
            this.translate.instant('CONVERSATION.MODIFIED'), 
            this.translate.instant('COMMON.OK'), 
            {duration: 2000});
        });
      } else if(result === ''){
        this.snackBar.open(
          this.translate.instant('CONVERSATION.EMPTY'), 
          this.translate.instant('COMMON.OK'), 
          {duration: 2000});
      }
    });
  }
}
