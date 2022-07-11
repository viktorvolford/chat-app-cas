import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Name, UserForm } from '../../shared/models/UserForm';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  public hide: boolean = true;

  public signUpForm = this.createForm({
    email: '',
    username: '',
    password: '',
    rePassword: '',
    name: this.createNameForm({
      firstname: '',
      lastname: ''
    })
  });

  constructor(
    private readonly location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService
    ) { }

  ngOnInit(): void {}

  public onSubmit() : void {
    const { password, rePassword } = this.signUpForm.value;
    if(password !== rePassword){
      this.toast.createSnackBar('LOGIN_REGISTER.PASSWORD_MISMATCH', 'COMMON.OK');
      return;
    }
    this.authService.signup(this.signUpForm);
  }

  public goBack(){
    this.location.back();
  }

  private createForm(model: UserForm) : FormGroup {
    const formGroup = this.formBuilder.group(model);
    formGroup.get('email')?.addValidators([Validators.required, Validators.email]);
    formGroup.get('username')?.addValidators([Validators.required, Validators.minLength(5)]);
    formGroup.get('password')?.addValidators([Validators.required, Validators.minLength(8)]);
    formGroup.get('rePassword')?.addValidators([Validators.required, Validators.minLength(8)]);
    return formGroup;
  }

  private createNameForm(model: Name) : FormGroup {
    const formGroup = this.formBuilder.group(model);
    formGroup.get('firstname')?.addValidators([Validators.required]);
    formGroup.get('lastname')?.addValidators([Validators.required]);
    return formGroup;
  }
}
