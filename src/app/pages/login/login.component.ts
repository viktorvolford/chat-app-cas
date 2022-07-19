import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AppState } from 'src/app/store/models/app.state';
import { select, Store } from '@ngrx/store';
import { loginWithEmailPassword, loginWithGoogle } from 'src/app/store/actions/user-session.actions';
import { Observable } from 'rxjs';
import { selectLoading } from 'src/app/store/selectors/loading.selector';
import { setLoading } from 'src/app/store/actions/loading.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent{

    public hide: boolean = true;
    public loading: Observable<boolean>;
    public loginForm: FormGroup;
     
    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly store: Store<AppState>
    ) {
        this.loading = this.store.pipe(select(selectLoading));

        this.loginForm = this.formBuilder.group({
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
            password: this.formBuilder.control('', [Validators.required, Validators.minLength(5)])
        });
    }
    
    public onSubmit(loginType: string) : void {
        this.store.dispatch(setLoading({value: true}));

        if(loginType === 'google'){
            this.store.dispatch(loginWithGoogle());
        } else {
            const { email, password } = this.loginForm.value;
            this.store.dispatch(loginWithEmailPassword({email, password}));
        }
        this.loginForm.reset();
    }
      
  }