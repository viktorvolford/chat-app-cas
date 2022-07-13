import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, map, Observable, ReplaySubject, share, switchMap, take, tap } from 'rxjs';
import { selectRoomType } from 'src/app/store/selectors/room-type.selector';
import { loadRooms } from '../../store/actions/rooms.actions';
import { AppState } from '../../store/models/app.state';
import { selectUserSession } from '../../store/selectors/user-session.selector';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private collectionName = 'Rooms';
  private user$: Observable<string>;
  private type$: Observable<string>;
  public rooms$: Observable<Room[]>

  constructor(
    private readonly afs: AngularFirestore,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {
    this.user$ = this.store.pipe(
      select(selectUserSession),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      }),
      distinctUntilChanged()
    );

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
        const [user, convoType] = data;
        let rooms$: Observable<Room[]>;
        if(convoType === 'public'){
          rooms$ = this.getPublicRooms();
        }
        else if(convoType === 'private'){
          rooms$ = this.getPrivateRooms(user);
        }
        else{
          rooms$ = this.getProtectedRooms();
        }
        return rooms$;
      }),
      tap(rooms => this.store.dispatch(loadRooms({rooms}))),
    )
  }

  public getRoomNameById(id: string) : Observable<string> {
    return this.afs.collection<Room>(this.collectionName).doc(id).valueChanges().pipe(
      map(room => room?.name as string),
      share({
        connector: () => new ReplaySubject(1),
        resetOnRefCountZero: false
      })
    );
  }

  public onSubmit(form: FormGroup, selectedUsers: Set<User>, chosenGroup: string): void {
    this.user$.pipe(take(1)).subscribe(user => {
      this.create({
        id: '',
        name: form.get('name')?.value as string,
        members: Array.from(selectedUsers).map(user => user.id),
        visibility: chosenGroup as string,
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

  private getPublicRooms() : Observable<Room[]> {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'public')).valueChanges();
  }

  private getPrivateRooms(user_id: string) : Observable<Room[]> {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'private').where('members', 'array-contains', user_id)).valueChanges();
  }

  private getProtectedRooms() : Observable<Room[]> {
    return this.afs.collection<Room>(this.collectionName, ref => ref.where('visibility', '==', 'protected')).valueChanges();
  }

  private create(room: Room) : Promise<void> {
    return this.afs.collection<Room>(this.collectionName).add(room).then(res => {
      this.afs.collection<Room>(this.collectionName).doc(res.id).update({id: res.id});
    });
  }
}