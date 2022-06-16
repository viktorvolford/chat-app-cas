import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  type?: string;
  id?: string;

  messages?: Array<Message>;
  users?: Array<User>;

  queryParamSubscription?: Subscription;
  messageLoadingSubscription?: Subscription;
  userLoadingSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParamMap.subscribe(result => {
        this.type = result.get('type') as string;
        this.id = result.get('id') as string; 

        if(this.type === 'personal'){
          this.messageLoadingSubscription = this.messageService.getPersonalMessages(this.id, localStorage.getItem('user') as string).subscribe(result => {
            this.messages = result;
          })
        } else {
          this.messageLoadingSubscription = this.messageService.getMessagesforRoom(this.id).subscribe(result => {
            this.messages = result;
          })
        }
    }); 
  }

  ngOnDestroy(): void {
    this.messageLoadingSubscription?.unsubscribe();
    this.userLoadingSubscription?.unsubscribe();
    this.queryParamSubscription?.unsubscribe();
  }
}
