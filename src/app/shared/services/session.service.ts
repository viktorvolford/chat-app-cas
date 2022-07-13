import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private keepAlive?: NodeJS.Timer;

  constructor(private readonly userService: UserService) {}

  public setUser(uid: string) : void {
    if(uid){
      this._startKeepAlive(uid);
    } else {
      clearInterval(this.keepAlive);
    }
  }

  private _startKeepAlive(user: string){
    this.userService.updateTime(user, new Date().getTime());
    this.keepAlive = setInterval(() => {
      this.userService.updateTime(user, new Date().getTime());
    }, 60000);
  }
}
