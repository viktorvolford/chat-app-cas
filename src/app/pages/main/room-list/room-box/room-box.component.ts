import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { Room } from '../../../../shared/models/Room';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomBoxComponent implements OnInit {

  @Input() room?: Room;
  @Input() users: User[] = [];
  @Input() chosenVisibility: string = '';
  @Input() isEven?: Boolean;

  @Output() openDialog: EventEmitter<Room> = new EventEmitter();
  @Output() openChatroom: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  onOpenDialog(room: Room | undefined){
    this.openDialog.emit(room);
  }

  onOpenChatroom(id: string | undefined){
    this.openChatroom.emit(id);
  }

}
