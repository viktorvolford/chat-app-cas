import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginForm } from 'src/app/shared/models/LoginForm';
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
export class LoginComponent implements OnInit {

    public hide: boolean = true;
    public loading: Observable<boolean>;
    
    public loginForm = this.formBuilder.group({
        email: '',
        password: ''
    } as LoginForm);
    
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly store: Store<AppState>
        ) {
            this.loading = this.store.pipe(select(selectLoading));
        }
        
    ngOnInit(): void {     
        this._addValidators();
    }
    
    public onSubmit(loginType: string) : void {
        this.store.dispatch(setLoading({value: true}));

        if(loginType === 'google'){
            this.store.dispatch(loginWithGoogle());
        } else {
            const { email, password } = this.loginForm.value;
            this.store.dispatch(loginWithEmailPassword({email, password}));
        }
        this._clearInputFields();
    }

    private _clearInputFields() : void {
        this.loginForm.get('email')?.setValue('');
        this.loginForm.get('password')?.setValue('');
        this.loginForm.get('email')?.setErrors(null);
        this.loginForm.get('password')?.setErrors(null);
    }
    
    private _addValidators() : void {
        this.loginForm.get('email')?.addValidators([Validators.required, Validators.email]);
        this.loginForm.get('password')?.addValidators([Validators.required, Validators.minLength(5)]);
    }
      
  }