import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(value: string, users: Pick<User, 'id' | 'name'>[]): string {
    const targetPerson = users.find(user => user.id === value);
    return targetPerson?.name.firstname + ' ' + targetPerson?.name.lastname;
  }

}
