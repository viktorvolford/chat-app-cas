import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/Room';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ProtectedDialogComponent } from './protected-dialog/protected-dialog.component';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListComponent implements OnChanges {

  @Input() public chosenVisibility: string = '';

  public rooms$? : Observable<Room[]>;
  public users$? : Observable<User[]>;

  constructor(
    private readonly roomService: RoomService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly toast: ToastService
    ) { }

  ngOnChanges(): void {
    this.rooms$ = this.roomService.getRooms(this.chosenVisibility as string);
    this.users$ = this.userService.users$;
  }

  public openChatroom(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'room', id: id}});
  }

  public openDialog(room: Room){
    const dialogRef = this.dialog.open(ProtectedDialogComponent, {data: {roomName: room.name}});

    dialogRef.afterClosed().subscribe(result => {
      if(result === room.password){
        this.openChatroom(room.id);
      } else if(result !== undefined && result !== null){
        this.toast.createSnackBar('MAIN.INCORRECT_PASSWORD','COMMON.OK');
      }
    });
  }
}
