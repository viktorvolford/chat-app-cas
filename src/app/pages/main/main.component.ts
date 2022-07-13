import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setRoomType } from 'src/app/store/actions/room-type.actions';
import { selectRoomType } from 'src/app/store/selectors/room-type.selector';
import { AppState } from '../../store/models/app.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  public chosenVisibility$: Observable<string>;

  constructor(private readonly store: Store<AppState>) {
    this.chosenVisibility$ = this.store.pipe(select(selectRoomType));
  }

  public onToggleChange(roomType: string): void {
    this.store.dispatch(setRoomType({roomType}));
  }
}
