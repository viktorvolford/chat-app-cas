import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {

  public hide: boolean = true;
  public signUpForm: FormGroup;

  constructor(
    private readonly location: Location,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService
    ) {
      this.signUpForm = this.formBuilder.group({
        email: this.formBuilder.control('', [Validators.required, Validators.email]),
        username: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
        password: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
        rePassword: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
        name: this.formBuilder.group({
          firstname: this.formBuilder.control('', [Validators.required]),
          lastname: this.formBuilder.control('', [Validators.required])
        })
      })
    }

  public onSubmit() : void {
    const { password, rePassword } = this.signUpForm.value;
    if(password !== rePassword){
      this.toast.createSnackBar('LOGIN_REGISTER.PASSWORD_MISMATCH', 'COMMON.OK');
      return;
    }
    this.authService.signup(this.signUpForm);
    this.signUpForm.reset();
  }

  public goBack(){
    this.location.back();
  }
}
