import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RoomService } from '../../../shared/services/room.service';
import { Room } from '../../../shared/models/Room';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  @Input() chosenVisibility: string | undefined;

  rooms: Array<Room> = new Array<Room>();

  roomsLoadingSubscription?: Subscription;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
   
  }

}
