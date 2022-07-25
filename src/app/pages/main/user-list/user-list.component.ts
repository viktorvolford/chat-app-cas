import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() public openConversation : EventEmitter<string> = new EventEmitter();

  constructor(
    private readonly sessionService: SessionService,
  ) {
    this.loggedInUser$ = this.sessionService.user$;
  }

  public onOpenConversation(id: string){
    this.openConversation.emit(id);
  }

  public isOnline(user: Pick<User, 'last_active'>): boolean {
    return new Date().getTime() - user.last_active > 60001 ? false : true;
  }

}
