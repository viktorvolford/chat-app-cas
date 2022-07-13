import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, ReplaySubject, share } from 'rxjs';
import { AppState } from 'src/app/store/models/app.state';
import { selectUserSession } from 'src/app/store/selectors/user-session.selector';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  public loggedInUser$: Observable<string>;
  public users$?: Observable<User[]>;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
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

    this.users$ = this.userService.users$;
  }

  public openConversation(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'personal', id: id}});
  }

  public isOnline(user: User): boolean {
    return new Date().getTime() - user.last_active > 60001 ? false : true;
  }

}
