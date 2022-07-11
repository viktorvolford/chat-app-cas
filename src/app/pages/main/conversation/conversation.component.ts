import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { User } from '../../../shared/models/User';
import { RoomService } from '../../../shared/services/room.service';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  private queryParamSubscription?: Subscription;
  private dialogSubscription?: Subscription;

  public convoType?: string;
  public convoId?: string;
  public loggedInUser: string = localStorage.getItem('user') as string;

  public messages$?: Observable<Message[]>;
  public users$: Observable<User[]>;
  public roomName$?: Observable<string | undefined>;

  public messageForm = this.formBuilder.group({
    id: '',
    content: '',
    sender_id: this.loggedInUser,
    target_id: '',
    type: '',
    date: new Date().getTime()
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
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

  private loadMessages(convoType?: string, convoId?: string){
    convoId = convoId as string;
    if(convoType === 'personal'){
      this.messages$ = this.messageService.getPersonalMessages(convoId, (localStorage.getItem('user') as string));
    } else {
      this.roomName$ = this.roomService.getRoomNameById(convoId);
      this.messages$ = this.messageService.getMessagesforRoom(convoId);
    }
  }

  public sendMessage(){
    this.messageService.sendMessage(this.messageForm);
  }

  public deleteMessage(message: Message){
    this.messageService.delete(message.id);
  }

  public openEditDialog(message: Message){
    this.messageService.openEditDialog(message);
  }

}
