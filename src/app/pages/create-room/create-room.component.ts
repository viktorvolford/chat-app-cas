import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { RoomService } from '../../shared/services/room.service';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { Room } from '../../shared/models/Room';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RoomForm } from '../../shared/models/RoomForm';

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
  selectedUsers = new Set<User>();
  filteredUsernames$ = new Observable<string[]>();

  roomForm = this.createForm({
    name: '',
    password: '',
    member: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private roomService: RoomService,
    private router: Router,
    private snackBar: MatSnackBar,
    public translate: TranslateService
    ) {
      this.users$ = this.userService.getAll();
    }

  ngOnInit(): void {
    this.filteredUsernames$ = this.roomForm.get('member')?.valueChanges.pipe(
      startWith(null),
      debounceTime(500),
      switchMap((searchValue: string | null) => searchValue ? this._filter(searchValue) : this.users$.pipe(
        map(users => users.map(user => user.username))
      )),
    ) as Observable<string[]>;
  }

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

  private _filter(searchValue: string): Observable<string[]> {
    const filterValue = searchValue.toLowerCase();

    return this.users$.pipe(
      map(users => users
        .map(user => user.username)
        .filter(username => username.toLowerCase().includes(filterValue))),
    )
  }

  onSubmit(){
    if(this.roomForm.valid){
      this.roomService.create({
        id: '',
        name: this.roomForm.get('name')?.value as string,
        members: Array.from(this.selectedUsers).map(user => user.id),
        visibility: this.chosenGroup as string,
        owner_id: localStorage.getItem('user'),
        password: this.roomForm.get('password')?.value as string,
      } as Room)
      .then(() => { 
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
