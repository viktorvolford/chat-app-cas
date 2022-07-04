import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  loggedInUser?: string;
  users$?: Observable<User[]>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.users$ = this.userService.getAll();
    this.loggedInUser = localStorage.getItem('user')?.slice(1,-1) as string;
  }

  openConversation(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'personal', id: id}});
  }

  isOnline(user: User): boolean {
    return new Date().getTime() - user.last_active > 60001 ? false : true;
  }

}
