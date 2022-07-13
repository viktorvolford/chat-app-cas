import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, distinctUntilChanged, Observable, ReplaySubject, share, take } from 'rxjs';
import { User } from '../../../shared/models/User';
import { RoomService } from '../../../shared/services/room.service';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/models/app.state';
import { selectUserSession } from '../../../store/selectors/user-session.selector';
import { selectConvoId, selectConvoType } from '../../../store/selectors/convo.selector';
import { setConvoId, setConvoType } from '../../../store/actions/convo.actions';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent {

  public convoType$: Observable<string>;
  public convoId$: Observable<string>;
  public loggedInUser$: Observable<string>;

  public messages$?: Observable<Message[]>;
  public users$: Observable<User[]>;
  public roomName$?: Observable<string | undefined>;

  public messageForm = this.formBuilder.group({
    id: '',
    content: '',
    sender_id: '',
    target_id: '',
    type: '',
    date: new Date().getTime()
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) { 
    this.loggedInUser$ = this.store.pipe(
      select(selectUserSession),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
    this.convoType$ = this.store.pipe(
      select(selectConvoType),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
    this.convoId$ = this.store.pipe(
      select(selectConvoId),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
    this.users$ = this.userService.users$;

    combineLatest([this.route.queryParamMap, this.loggedInUser$]).pipe(take(1)).subscribe(data => {
      const [paramMap, user] = data;
      const convoType = paramMap.get('type') as string;
      const convoId = paramMap.get('id') as string;
      this.store.dispatch(setConvoType({convoType}));
      this.store.dispatch(setConvoId({convoId}));
      this.messageForm.get('type')?.setValue(convoType);
      this.messageForm.get('sender_id')?.setValue(user);
      this.messageForm.get('target_id')?.setValue(convoId);
      this._loadMessages(convoType, convoId);
    });
  }

  private _loadMessages(convoType: string, convoId: string) : void {
    if(convoType === 'personal'){
      this.loggedInUser$.pipe(take(1)).subscribe(user => {
        this.messages$ = this.messageService.getPersonalMessages(convoId, user);
      });
    } else {
      this.roomName$ = this.roomService.getRoomNameById(convoId);
      this.messages$ = this.messageService.getMessagesforRoom(convoId);
    }
  }

  public sendMessage() : void {
    this.messageService.sendMessage(this.messageForm);
  }

  public deleteMessage(message: Message) : void {
    this.messageService.delete(message.id);
  }

  public openEditDialog(message: Message) : void {
    this.messageService.openEditDialog(message);
  }

}
