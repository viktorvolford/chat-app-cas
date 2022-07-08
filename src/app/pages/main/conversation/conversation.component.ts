import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, ReplaySubject, share, Subscription, take } from 'rxjs';
import { User } from '../../../shared/models/User';
import { RoomService } from '../../../shared/services/room.service';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  convoType?: string;
  convoId?: string;
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
    this.users$ = this.userService.users$;
  }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParamMap.pipe(take(1)).subscribe(result => {
        this.convoType = result.get('type') as string;
        this.convoId = result.get('id') as string; 

        this.messageForm.get('type')?.setValue(this.convoType);
        this.messageForm.get('target_id')?.setValue(this.convoId);

        this.loadMessages(this.convoType, this.convoId);
    }); 
  }

  ngOnDestroy(): void {
    this.queryParamSubscription?.unsubscribe();
    this.dialogSubscription?.unsubscribe();
  }

  loadMessages(convoType?: string, convoId?: string){
    convoId = convoId as string;
    if(convoType === 'personal'){
      this.messages$ = this.messageService.getPersonalMessages(convoId, (localStorage.getItem('user') as string));
    } else {
      this.roomName$ = this.roomService.getById(convoId).pipe(
        map(room => room?.name),
        share({
          connector: () => new ReplaySubject(1),
          resetOnRefCountZero: false
        })
      );
      this.messages$ = this.messageService.getMessagesforRoom(convoId);
    }
  }

  sendMessage(){
    this.messageService.sendMessage(this.messageForm);
  }

  deleteMessage(message: Message){
    this.messageService.delete(message.id).then(() => {
      this.snackBar.open(
        this.translate.instant('CONVERSATION.DELETED'), 
        this.translate.instant('COMMON.OK'), 
        {duration: 2000});
    });
  }

  openEditDialog(message: Message){
    this.messageService.openEditDialog(message);
  }

}
