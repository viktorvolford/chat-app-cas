import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConvoType, Message } from '../models/Message';
import { combineLatest, map, Observable, of, ReplaySubject, share, switchMap, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../pages/main/conversation/edit-dialog/edit-dialog.component';
import { ToastService } from './toast.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/models/app.state';
import { loadMessages } from 'src/app/store/actions/messages.actions';

@Injectable()
export class MessageService {

  private collectionName = 'Messages';

  constructor(
    private readonly afs: AngularFirestore,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
    private readonly store: Store<AppState>
    ) { }

  public getMessagesforRoom(id: string) : Observable<Message[]> {
    return this.afs.collection<Message>(this.collectionName, ref => ref
      .where('type', '==', ConvoType.Room)
      .where('target_id', '==', id)
      .orderBy('date', 'asc'))
      .valueChanges().pipe(
        tap(messages => this.store.dispatch(loadMessages({messages}))),
        share({
          connector: () => new ReplaySubject(1),
          resetOnRefCountZero: false
        })
      );
  }

  public getPersonalMessages(firstId: string, secondId: string) : Observable<Message[]> {
     const first = this.afs.collection<Message>(this.collectionName, ref => ref
        .where('type', '==', ConvoType.Personal)
        .where('sender_id', '==', firstId)
        .where('target_id', '==', secondId)
        .orderBy('date', 'asc'))
        .valueChanges();
      if(firstId === secondId){
        return first;
      }
      const second = this.afs.collection<Message>(this.collectionName, ref => ref
        .where('type', '==', ConvoType.Personal)
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
        tap(messages => this.store.dispatch(loadMessages({messages}))),
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

  public sendMessage(form: FormGroup) : void {
    if (form.get('content')?.value) {
      form.get('date')?.setValue(new Date().getTime());

      this.create(form.value as Message).then(_ => {
        form.get('content')?.setValue('');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  public openEditDialog(message: Message) : void {
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

  private create(message: Message) : Promise<void> {
    return this.afs.collection<Message>(this.collectionName).add(message).then(res => {
      this.afs.collection<Message>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }

  private update(message: Message) : Promise<void> {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }
}
