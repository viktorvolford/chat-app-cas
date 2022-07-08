import { Component, OnInit, Input, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/Room';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ProtectedDialogComponent } from './protected-dialog/protected-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() chosenVisibility: string = '';

  rooms$? : Observable<Room[]>;
  users$? : Observable<User[]>;

  dialogSubscription?: Subscription;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService
    ) { }

  ngOnChanges(): void {
    this.rooms$ = this.roomService.getRooms(this.chosenVisibility as string);
    this.users$ = this.userService.users$;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.dialogSubscription?.unsubscribe();
  }

  openChatroom(id: string){
    this.router.navigate(['main/conversation'], {queryParams: {type: 'room', id: id}});
  }

  openDialog(room: Room){
    const dialogRef = this.dialog.open(ProtectedDialogComponent, {data: {roomName: room.name}});

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if(result === room.password){
        this.openChatroom(room.id);
      } else if(result !== undefined && result !== null){
        this.snackBar.open('The entered password was incorrect!', 'OK', {duration: 2000});
      }
    });
  }
}
