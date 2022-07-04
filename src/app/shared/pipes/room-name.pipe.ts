import { Pipe, PipeTransform } from '@angular/core';
import { Room } from '../models/Room';

@Pipe({
  name: 'roomName'
})
export class RoomNamePipe implements PipeTransform {

  transform(room: Room | null | undefined): unknown {
    return room?.name;
  }

}
