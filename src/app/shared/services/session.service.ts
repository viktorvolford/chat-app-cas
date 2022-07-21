import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, ReplaySubject, share, take } from 'rxjs';
import { selectUserSession } from '../../store/selectors/user-session.selector';
import { loginSuccess, logout } from '../../store/actions/user-session.actions';
import { AppState } from '../../store/models/app.state';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private keepAlive?: NodeJS.Timer;
  public user$: Observable<string>;

  constructor(
    private readonly userService: UserService,
    private readonly store: Store<AppState>
  ) {
    this.user$ = this.store.pipe(
      select(selectUserSession),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );
  }

  public setUser(uid: string) : void {
    if(uid){
      this.store.dispatch(loginSuccess({id: uid}));
      this._startKeepAlive(uid);
    } else {
      clearInterval(this.keepAlive);
    }
  }

  private _startKeepAlive(user: string) : void {
    this.userService.updateTime(user, new Date().getTime());
    this.keepAlive = setInterval(() => {
      this.userService.updateTime(user, new Date().getTime());
    }, 60000);
  }
}
