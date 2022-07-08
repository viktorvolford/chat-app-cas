import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { RoomService } from '../../shared/services/room.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RoomForm } from '../../shared/models/RoomForm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent implements OnInit {

  chosenGroup?: string;

  @ViewChild('memberInput') memberInput?: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ ENTER, COMMA ];

  users$: Observable<User[]>;
  filteredUsernames$: Observable<string[]>;
  selectedUsers = new Set<User>();

  roomForm = this.createForm({
    name: '',
    password: '',
    member: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private roomService: RoomService,
    public translate: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
      this.users$ = this.userService.users$;
      this.filteredUsernames$ = this.userService.getFilteredUsernames(this.roomForm.get('member') as AbstractControl<any>);
    }

  ngOnInit(): void {}

  createForm(model: RoomForm) {
    let formGroup = this.formBuilder.group(model);
    formGroup.get('name')?.addValidators([Validators.required]);
    formGroup.get('password')?.addValidators([Validators.minLength(4)]);
    return formGroup;
  }

  add(event: MatChipInputEvent, users: User[]): void {
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

  selected(event: MatAutocompleteSelectedEvent, users: User[]): void {
    const user = users.find(user => user.username === event.option.viewValue) as User;
    this.selectedUsers.add(user);
    (this.memberInput as ElementRef<HTMLInputElement>).nativeElement.value = '';
    this.roomForm.get('member')?.setValue(null);
  }

  removeChip(member: User){
    const index = this.selectedUsers.delete(member);
  }

  onSubmit(){
    if(this.roomForm.valid){
      this.roomService.onSubmit(this.roomForm, this.selectedUsers, this.chosenGroup as string).then(() => { 
        this.snackBar.open(
          this.translate.instant('CREATE_ROOM.CREATED'), 
          this.translate.instant('COMMON.GREAT'), 
          {duration: 2000});
        this.router.navigateByUrl('/main');
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
