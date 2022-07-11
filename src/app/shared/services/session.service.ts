import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private keepAlive?: NodeJS.Timer;

  public currentUser$ : BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private readonly userService: UserService) {
    this.currentUser$.next(localStorage.getItem('user') as string);
  }

  //After logging in
  public setUser(uid: string) : void {
    const id : string = JSON.stringify(uid).slice(1, -1);
    localStorage.setItem('user', id);
    this.currentUser$.next(id);
    this._startKeepAlive(id);
  }

  //After logging out
  public clearUser() : void {
    localStorage.removeItem('user');
    this.currentUser$.next('');
    clearInterval(this.keepAlive);
  }


  private _startKeepAlive(user: string){
    this.userService.updateTime(user, new Date().getTime());
    this.keepAlive = setInterval(() => {
      this.userService.updateTime(user, new Date().getTime());
    }, 60000);
  }
}
