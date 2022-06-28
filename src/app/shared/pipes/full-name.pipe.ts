import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(value: string, users: User[]): string {
    return users.find(user => user.id === value)?.username as string;
  }

}
