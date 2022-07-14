import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/shared/services/session.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  public loggedInUser$: Observable<string>;
  @Input() public users: User[] | null = [];

  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ) {
    this.loggedInUser$ = this.sessionService.user$;
  }

  public openConversation(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'personal', id: id}});
  }

  public isOnline(user: User): boolean {
    return new Date().getTime() - user.last_active > 60001 ? false : true;
  }

}
