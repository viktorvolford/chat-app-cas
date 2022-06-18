import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/Room';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ProtectedDialogComponent } from './protected-dialog/protected-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() chosenVisibility: string | undefined;

  rooms: Array<Room> = new Array<Room>();

  roomsLoadingSubscription?: Subscription;
  dialogSubscription?: Subscription;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ) { }

  ngOnChanges(): void {
    this.roomsLoadingSubscription = this.roomService.getRooms(this.chosenVisibility as string).subscribe((data: Array<Room>) => {
      this.rooms = data;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.roomsLoadingSubscription?.unsubscribe();
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
      } else if(result !== null){
        this.snackBar.open('The entered password was incorrect!', 'OK', {duration: 2000});
      }
    });
  }

}
