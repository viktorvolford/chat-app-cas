import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  users?: Array<User>;
  loggedInUser?: string;

  userLoadingSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userLoadingSubscription = this.userService.getAll().subscribe(result => {
      this.users = result;
      this.loggedInUser = localStorage.getItem('user')?.slice(1,-1) as string;
    });
  }

  ngOnDestroy(): void {
    this.userLoadingSubscription?.unsubscribe();
  }

  openConversation(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'personal', id: id}});
  }

  isOnline(user: User): boolean {
    return new Date().getTime() - user.last_active > 50000 ? false : true;
  }

}
