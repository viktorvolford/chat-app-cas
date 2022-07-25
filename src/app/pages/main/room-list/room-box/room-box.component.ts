import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { Room } from '../../../../shared/models/Room';
import { RoomType } from '../../../../shared/models/RoomType';


@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomBoxComponent {

  public roomType = RoomType;

  @Output() private openDialog: EventEmitter<Room> = new EventEmitter();
  @Output() private openChatroom: EventEmitter<string> = new EventEmitter();

  @Input() public room!: Room;
  @Input() public users!: User[];
  @Input() public chosenType!: RoomType;
  @Input() public isEven!: Boolean;

  constructor() { }

  public onOpenDialog(room: Room){
    this.openDialog.emit(room);
  }

  public onOpenChatroom(id: string){
    this.openChatroom.emit(id);
  }

}
