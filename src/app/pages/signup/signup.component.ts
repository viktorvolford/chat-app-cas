import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Name, UserForm } from '../../shared/models/UserForm';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  hide: boolean = true;

  signUpForm = this.createForm({
    email: '',
    username: '',
    password: '',
    rePassword: '',
    name: this.createForm({
      firstname: '',
      lastname: ''
    })
  });

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
  }

  createForm(model: UserForm | Name) {
    let formGroup = this.formBuilder.group(model);
    formGroup.get('email')?.addValidators([Validators.required, Validators.email]);
    formGroup.get('username')?.addValidators([Validators.required, Validators.minLength(5)]);
    formGroup.get('password')?.addValidators([Validators.required, Validators.minLength(8)]);
    formGroup.get('rePassword')?.addValidators([Validators.required, Validators.minLength(8)]);
    formGroup.get('name.firstname')?.addValidators([Validators.required]);
    formGroup.get('name.lastname')?.addValidators([Validators.required]);
    return formGroup;
  }

  onSubmit(){
    if(this.signUpForm.get('password')?.value !== this.signUpForm.get('rePassword')?.value){
      this.snackBar.open(
        this.translate.instant('LOGIN_REGISTER.PASSWORD_MISMATCH'), 
        this.translate.instant('COMMON.OK'), 
        {duration: 2000});
      return;
    }
    this.authService.signup(this.signUpForm.get('email')?.value as string, this.signUpForm.get('password')?.value as string)
    .then(cred => {
      this.userService.createUserFromForm(this.signUpForm, cred as any);
    }).catch(error => {
      console.log(error);
    });
  }

  goBack(){
    this.location.back();
  }
}
