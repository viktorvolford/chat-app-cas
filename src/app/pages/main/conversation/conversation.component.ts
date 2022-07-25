import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, distinctUntilChanged, Observable, ReplaySubject, share, take } from 'rxjs';
import { User } from '../../../shared/models/User';
import { RoomService } from '../../../shared/services/room.service';
import { Message } from '../../../shared/models/Message';
import { ConvoType } from '../../../shared/models/ConvoType';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/models/app.state';
import { selectConvoId, selectConvoType } from '../../../store/selectors/convo.selector';
import { setConvoId, setConvoType } from '../../../store/actions/convo.actions';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent {

  public convoType = ConvoType;
  public convoType$: Observable<ConvoType | null>;
  public convoId$: Observable<string | null>;
  public loggedInUser$: Observable<string>;

  public messages$?: Observable<Message[]>;
  public users$: Observable<User[]>;
  public roomName$!: Observable<string>;

  public messageForm = this.formBuilder.group({
    id: this.formBuilder.control(''),
    content: this.formBuilder.control(''),
    sender_id: this.formBuilder.control(''),
    target_id: this.formBuilder.control(''),
    type: this.formBuilder.control<ConvoType | null>(null),
    date: this.formBuilder.control<number>(Date.now())
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) { 
    this.loggedInUser$ = this.sessionService.user$;
    this.users$ = this.userService.users$;

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

    combineLatest([this.route.queryParamMap, this.loggedInUser$]).pipe(take(1)).subscribe(data => {
      const [paramMap, user] = data;
      const convoType = +(paramMap.get('type')!) as ConvoType;
      console.log(typeof convoType);
      const convoId = paramMap.get('id') as string;
      this.store.dispatch(setConvoType({convoType}));
      this.store.dispatch(setConvoId({convoId}));
      this.messageForm.get('type')?.setValue(convoType);
      this.messageForm.get('sender_id')?.setValue(user);
      this.messageForm.get('target_id')?.setValue(convoId);
      this._loadMessages(convoType, convoId);
    });
  }

  private _loadMessages(convoType: ConvoType, convoId: string) : void {
    switch(convoType){
      case ConvoType.Personal:
        this.loggedInUser$.pipe(take(1)).subscribe(user => {
          this.messages$ = this.messageService.getPersonalMessages(convoId, user);
        });
        break;
      case ConvoType.Room:
        this.roomName$ = this.roomService.getRoomNameById(convoId);
        this.messages$ = this.messageService.getMessagesforRoom(convoId);
        break;
      default:
        this.loggedInUser$.pipe(take(1)).subscribe(user => {
          this.messages$ = this.messageService.getPersonalMessages(convoId, user);
        });
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
