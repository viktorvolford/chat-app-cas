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
  selectedMembers = new Set<string>();
  filteredUsers?: Observable<string[]>;

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
    this.filteredUsers = this.roomForm.get('member')?.valueChanges.pipe(
      startWith('') as any,
      map((member: string | null) => (member ? this._filter(member) : this.allUsers.slice())),
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
    if (!this.selectedMembers.has(value)) {
      this.selectedMembers.add(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.roomForm.get('member')?.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedMembers.add(event.option.viewValue);
    (this.memberInput as any).nativeElement.value = '';
    this.roomForm.get('member')?.setValue(null);
  }

  removeChip(member: any){
    const index = this.selectedMembers.delete(member);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers
      .map(user => user.username)
      .filter(username => username.toLowerCase().includes(filterValue));
  }

  onSubmit(){}

}
