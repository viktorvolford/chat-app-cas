import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, ReplaySubject, share } from 'rxjs';
import { User } from '../../shared/models/User';
import { setRoomType } from '../../store/actions/room-type.actions';
import { selectRoomType } from '../../store/selectors/room-type.selector';
import { AppState } from '../../store/models/app.state';
import { UserService } from '../../shared/services/user.service';
import { RoomType } from '../../shared/models/RoomType';
import { Router } from '@angular/router';
import { ConvoType } from 'src/app/shared/models/ConvoType';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  public roomType = RoomType;
  public convoType = ConvoType;
  public chosenType$: Observable<RoomType>;
  public users$ : Observable<User[]>;

  constructor(
    private readonly store: Store<AppState>,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    this.chosenType$ = this.store.pipe(
      select(selectRoomType),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
    this.users$ = this.userService.users$;
  }

  public onToggleChange(roomType: RoomType): void {
    console.log(roomType);
    this.store.dispatch(setRoomType({roomType}));
  }

  public openConversation(id: string, type: ConvoType) : void {
    this.router.navigate(['main/conversation'], {queryParams: {type, id}});
  }
}
