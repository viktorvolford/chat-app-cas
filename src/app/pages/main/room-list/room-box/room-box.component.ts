import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { Room } from '../../../../shared/models/Room';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomBoxComponent {

  @Output() private openDialog: EventEmitter<Room> = new EventEmitter();
  @Output() private openChatroom: EventEmitter<string> = new EventEmitter();

  @Input() public room!: Room;
  @Input() public users: User[] | null = [];
  @Input() public chosenVisibility!: string;
  @Input() public isEven!: Boolean;

  constructor() { }

  public onOpenDialog(room: Room){
    this.openDialog.emit(room);
  }

  public onOpenChatroom(id: string){
    this.openChatroom.emit(id);
  }

}
