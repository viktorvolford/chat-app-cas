import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, ReplaySubject, share } from 'rxjs';
import { User } from '../../shared/models/User';
import { setRoomType } from '../../store/actions/room-type.actions';
import { selectRoomType } from '../../store/selectors/room-type.selector';
import { AppState } from '../../store/models/app.state';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  public chosenVisibility$: Observable<string>;
  public users$ : Observable<User[]>;

  constructor(
    private readonly store: Store<AppState>,
    private readonly userService: UserService
  ) {
    this.chosenVisibility$ = this.store.pipe(
      select(selectRoomType),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
    this.users$ = this.userService.users$;
  }

  public onToggleChange(roomType: string): void {
    this.store.dispatch(setRoomType({roomType}));
  }
}
