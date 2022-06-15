import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { RoomService } from '../../shared/services/room.service';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  chosenGroup?: string;

  @ViewChild('memberInput') memberInput?: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  allUsers = new Array<User>();
  selectedMembers = new Set<User>();
  filteredUsernames?: Observable<string[]>;

  usersLoadingSubscription?: Subscription;

  roomForm = this.createForm({
    name: '',
    password: '',
    member: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private roomService: RoomService
    ) {}

  ngOnInit(): void {
    this.usersLoadingSubscription = this.userService.getAll().subscribe((data: Array<User>) => {
      this.allUsers = data;
    });
    this.filteredUsernames = this.roomForm.get('member')?.valueChanges.pipe(
      startWith('') as any,
      map((member: string | null) => (member ? this._filter(member) : this.allUsers.map(user => user.username).slice())),
    ) as any;
  }

  ngOnDestroy(): void {
    this.usersLoadingSubscription?.unsubscribe;
  }

  createForm(model: any) {
    let formGroup = this.formBuilder.group(model);
    formGroup.get('name')?.addValidators([Validators.required]);
    formGroup.get('password')?.addValidators([Validators.required, Validators.minLength(4)]);
    return formGroup;
  }

  add(event: MatChipInputEvent): void {
    const value = event.value;

    // Add our member
    if (!this.selectedMembers.has(this.allUsers.find(user => user.username === value) as User) 
      && this.allUsers.map(user => user.username).includes(value)) {
      this.selectedMembers.add(this.allUsers.find(user => user.username === value) as User);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.roomForm.get('member')?.setValue(null);
    console.log(this.selectedMembers);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedMembers.add(this.allUsers.find(user => user.username === event.option.viewValue) as User);
    (this.memberInput as any).nativeElement.value = '';
    this.roomForm.get('member')?.setValue(null);
  }

  removeChip(member: any){
    const index = this.selectedMembers.delete(member);
    console.log(this.selectedMembers);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers
      .map(user => user.username)
      .filter(username => username.toLowerCase().includes(filterValue));
  }

  onSubmit(){}

}
