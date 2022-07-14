import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoginForm } from 'src/app/shared/models/LoginForm';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

    public hide: boolean = true;
    public loading: boolean = false;
    
    public loginForm = this.formBuilder.group({
        email: '',
        password: ''
    } as LoginForm);
    
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly toast: ToastService
        ) { }
        
    ngOnInit(): void {     
        this.addValidators();
    }
    
    public login(loginType: string) : void {
        this.loading = true;
        this.getCredentialsForType(loginType).then(cred => {
            this.userService.createNonExistingUser(cred);
        }).catch(err => {
            this.onAuthFailed(err);
        }).finally(() => {
            this.loading = false; 
        });
    }

    private onAuthFailed(err: any) : void {
        console.error(err);
        this.loginForm.get('email')?.setValue('');
        this.loginForm.get('password')?.setValue('');
        this.toast.createSnackBar('LOGIN_REGISTER.AUTH_FAILED', 'COMMON.OK', 1000);
    }

    private getCredentialsForType(loginType: string) : Promise<any> {
        if(loginType === 'google'){
            return this.authService.loginWithGoogle();
        } else {
            const { email, password} = this.loginForm.value;
            return this.authService.login(email as string, password as string);
        }
    }
    
    private addValidators() : void {
        this.loginForm.get('email')?.addValidators([Validators.required, Validators.email]);
        this.loginForm.get('password')?.addValidators([Validators.required, Validators.minLength(5)]);
    }
      
  }