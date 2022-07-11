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

  @Output() private openDialog: EventEmitter<Room> = new EventEmitter();
  @Output() private openChatroom: EventEmitter<string> = new EventEmitter();

  @Input() public room?: Room;
  @Input() public users: User[] = [];
  @Input() public chosenVisibility: string = '';
  @Input() public isEven?: Boolean;

  constructor() { }

  ngOnInit(): void {}

  public onOpenDialog(room: Room | undefined){
    this.openDialog.emit(room);
  }

  public onOpenChatroom(id: string | undefined){
    this.openChatroom.emit(id);
  }

}
