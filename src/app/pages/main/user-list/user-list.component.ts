import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  public loggedInUser?: string;
  public users$?: Observable<User[]>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.users$ = this.userService.users$;
    this.loggedInUser = localStorage.getItem('user') as string;
  }

  public openConversation(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'personal', id: id}});
  }

  public isOnline(user: User): boolean {
    return new Date().getTime() - user.last_active > 60001 ? false : true;
  }

}
