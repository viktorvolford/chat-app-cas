import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  transform(value: string, users: User[] | null): string {
    return users?.find(user => user.id === value)?.username as string;
  }
}
