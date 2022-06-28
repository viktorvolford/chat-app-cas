import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'username',
  standalone: true
})
export class UsernamePipe implements PipeTransform {

  transform(value: string, users: User[]): string {
    const targetPerson = users.find(user => user.id === value);
    return targetPerson?.name.firstname + ' ' + targetPerson?.name.lastname;
  }

}
