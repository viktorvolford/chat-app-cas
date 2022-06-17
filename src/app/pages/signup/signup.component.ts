import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

import { User } from '../../shared/models/User'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
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
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  createForm(model: any) {
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
      window.alert('Nem egyeznek meg a megadott jelszavak!');
      return;
    }
    this.authService.signup(this.signUpForm.get('email')?.value as string, this.signUpForm.get('password')?.value as string)
    .then(cred => {
      const user : User = {
        id: cred.user?.uid as string,
        email: this.signUpForm.get('email')?.value as string,
        username: this.signUpForm.get('username')?.value as string,
        name: {
          firstname: this.signUpForm.get('name.firstname')?.value,
          lastname: this.signUpForm.get('name.lastname')?.value
        }
      };
      this.userService.create(user).then(_ => {
        this._snackBar.open('User has been created successfully!', 'Great', {duration: 2000});
        this.router.navigateByUrl('/main');
      }).catch(error => {
        console.log(error);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  goBack(){
    this.location.back();
  }
}
