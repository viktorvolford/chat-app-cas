import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, EMPTY, map, Observable, ReplaySubject, share, switchMap, take, tap } from 'rxjs';
import { selectRoomType } from 'src/app/store/selectors/room-type.selector';
import { loadRooms } from '../../store/actions/rooms.actions';
import { AppState } from '../../store/models/app.state';
import { Room, RoomType } from '../models/Room';
import { User } from '../models/User';
import { SessionService } from './session.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private collectionName = 'Rooms';
  private user$: Observable<string>;
  private type$: Observable<RoomType>;
  public rooms$: Observable<Room[]>

  constructor(
    private readonly afs: AngularFirestore,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly store: Store<AppState>
  ) {
    this.user$ = this.sessionService.user$;

    this.type$ = this.store.pipe(
      select(selectRoomType),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );

    this.rooms$ = combineLatest([this.user$, this.type$]).pipe(
      switchMap(data => {
        const [user, roomType] = data;
        return this._getRooms(roomType, user);
      }),
      tap(rooms => this.store.dispatch(loadRooms({rooms}))),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    )
  }

  public getRoomNameById(id: string) : Observable<string> {
    return this.rooms$.pipe(
      map(rooms => (rooms.find(room => room.id === id) as Room).name),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  public onSubmit(form: FormGroup, selectedUsers: Set<User>, chosenType: RoomType): void {
    this.user$.pipe(take(1)).subscribe(user => {
      this._create({
        id: '',
        name: form.get('name')?.value as string,
        members: Array.from(selectedUsers).map(user => user.id),
        type: chosenType,
        owner_id: user,
        password: form.get('password')?.value as string,
      } as Room).then(_ => {
        this.toast.createSnackBar('CREATE_ROOM.CREATED', 'COMMON.GREAT');
        this.router.navigateByUrl('/main');
      }).catch(error => {
        console.log(error);
      });
    });
  }

  private _getRooms(type : RoomType, user : string) : Observable<Room[]> {
    switch(type){
      case RoomType.Public:
      case RoomType.Protected:
        return this.afs.collection<Room>(this.collectionName, ref => ref.where('type', '==', type)).valueChanges();
      case RoomType.Private:
        return this.afs.collection<Room>(this.collectionName, ref => ref.where('type', '==', type).where('members', 'array-contains', user)).valueChanges();
      default:
        return EMPTY;
    }    
  }

  private _create(room: Room) : Promise<void> {
    return this.afs.collection<Room>(this.collectionName).add(room).then(res => {
      this.afs.collection<Room>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }
}