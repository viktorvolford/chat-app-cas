import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { RoomService } from '../../shared/services/room.service';
import { Observable } from 'rxjs';
import { RoomType } from '../../shared/models/RoomType';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent implements OnInit {

  public selectedUsers = new Set<User>();

  public roomType = RoomType;
  public chosenType!: RoomType;

  @ViewChild('memberInput') private memberInput?: ElementRef<HTMLInputElement>;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];

  public users$: Observable<User[]>;
  public filteredUsernames$: Observable<string[]>;

  public roomForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    ) {
      this.roomForm = this.formBuilder.group({
        name: this.formBuilder.control('', [Validators.required]),
        password: this.formBuilder.control('', [Validators.minLength(4)]),
        member: this.formBuilder.control('')
      })
      this.users$ = this.userService.users$;
      this.filteredUsernames$ = this.userService.getFilteredUsernames(this.roomForm.get('member') as AbstractControl);
    }

  ngOnInit(): void {}

  public add(event: MatChipInputEvent, users: Pick<User, 'username'>[]): void {
    const value = event.value;

    // Add our member
    const user = users.find(user => user.username === value) as User;
    if (!this.selectedUsers.has(user) 
      && users.map(user => user.username).includes(value)) {
      this.selectedUsers.add(user);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.roomForm.get('member')?.setValue(null);
  }

  public selected(event: MatAutocompleteSelectedEvent, users: User[]): void {
    const user = users.find(user => user.username === event.option.viewValue) as User;
    this.selectedUsers.add(user);
    (this.memberInput as ElementRef<HTMLInputElement>).nativeElement.value = '';
    this.roomForm.get('member')?.setValue(null);
  }

  public removeChip(member: User){
    const index = this.selectedUsers.delete(member);
  }

  public onSubmit(){
    if(this.roomForm.valid){
      this.roomService.onSubmit(this.roomForm, this.selectedUsers, this.chosenType);
    }
  }
}
