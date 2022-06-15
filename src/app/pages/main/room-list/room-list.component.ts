import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/Room';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() chosenVisibility: string | undefined;

  rooms: Array<Room> = new Array<Room>();

  roomsLoadingSubscription?: Subscription;

  constructor(private roomService: RoomService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.roomsLoadingSubscription = this.roomService.getRooms(this.chosenVisibility as string).subscribe((data: Array<Room>) => {
      this.rooms = data;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.roomsLoadingSubscription?.unsubscribe;
  }

}
