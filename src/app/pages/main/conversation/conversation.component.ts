import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { User } from '../../../shared/models/User';
import { RoomService } from '../../../shared/services/room.service';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  type?: string;
  id?: string;
  loggedInUser: string = localStorage.getItem('user') as string;

  messages$?: Observable<Message[]>;
  users$: Observable<User[]>;
  roomName$?: Observable<string | undefined>;

  queryParamSubscription?: Subscription;
  dialogSubscription?: Subscription;

  messageForm = this.formBuilder.group({
    id: '',
    content: '',
    sender_id: this.loggedInUser,
    target_id: '',
    type: '',
    date: new Date().getTime()
  });

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private messageService: MessageService,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public translate: TranslateService
  ) { 
    this.users$ = this.userService.getAll();
  }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParamMap.subscribe(result => {
        this.type = result.get('type') as string;
        this.id = result.get('id') as string; 

        this.messageForm.get('type')?.setValue(this.type);
        this.messageForm.get('target_id')?.setValue(this.id);

        if(this.type === 'personal'){
          this.messages$ = this.messageService.getPersonalMessages(this.id, (localStorage.getItem('user') as string));
        } else {
          this.roomName$ = this.roomService.getById(this.id).pipe(map(room => room?.name));
          this.messages$ = this.messageService.getMessagesforRoom(this.id);
        }
    }); 
  }

  ngOnDestroy(): void {
    this.queryParamSubscription?.unsubscribe();
    this.dialogSubscription?.unsubscribe();
  }

  sendMessage(){
    console.log(this.messageForm.value);
    if (this.messageForm.get('content')?.value) {
      this.messageForm.get('date')?.setValue(new Date().getTime());

      this.messageService.create(this.messageForm.value as Message).then(_ => {
        this.messageForm.get('content')?.setValue('');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  delete(message: Message){
    this.messageService.delete(message.id).then(() => {
      this.snackBar.open(
        this.translate.instant('CONVERSATION.DELETED'), 
        this.translate.instant('COMMON.OK'), 
        {duration: 2000});
    });
  }

  openEditDialog(message: Message){
    const dialogRef = this.dialog.open(EditDialogComponent, {data: {message}});

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if(result && result !== message.content){
        message.content = result; 
        this.messageService.update(message).then(() => {
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
