import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { User } from '../../shared/models/User';

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
        password: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
        rePassword: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
        name: this.formBuilder.group({
          firstname: this.formBuilder.control('', [Validators.required]),
          lastname: this.formBuilder.control('', [Validators.required])
        })
      })
    }

  public onSubmit() : void {
    if(this.signUpForm.valid){
      const formData = Object.assign({}, this.signUpForm.value);
      if(formData.password !== formData.rePassword){
        this.toast.createSnackBar('LOGIN_REGISTER.PASSWORD_MISMATCH', 'COMMON.OK');
        return;
      }
      const user: User = {
        id: '',
        username: formData.username,
        email: formData.email,
        name: {
          firstname: formData.name.firstname,
          lastname: formData.name.lastname
        },
        last_active: Date.now()
      }
      this.authService.signup(user, formData.password);
      this.signUpForm.reset();
    }
  }

  public goBack(){
    this.location.back();
  }
}
