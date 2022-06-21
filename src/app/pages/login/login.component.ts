import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    hide: boolean = true;
    loading: boolean = false;
    
    loginForm = this.formBuilder.group({
        email: [''],
        password: ['']
    });
    
    constructor(
        private router: Router, 
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar
        ) { }
        
        ngOnInit(): void {     
            this.addValidators();
        }
        
        login(loginType: string){
            this.loading = true;
            this.getCredentialsForType(loginType)
                .then(cred => {
                    console.log(cred);
                    this.router.navigateByUrl('/main');
                }).catch(err => {
                    console.error(err);
                    this.loginForm.get('email')?.setValue('');
                    this.loginForm.get('password')?.setValue('');
                    this.snackBar.open('Authentication has failed.', 'OK', {duration: 1000});
                }).finally(() => {
                    this.loading = false; 
                });
        }

        getCredentialsForType(loginType: string) : Promise<any> {
            if(loginType === 'google'){
                return this.authService.loginWithGoogle();;
            } else {
                return this.authService.login(this.loginForm.get('email')?.value as string, this.loginForm.get('password')?.value as string);
            }
        }
        
        addValidators() {
            this.loginForm.get('email')?.addValidators([Validators.required, Validators.email]);
            this.loginForm.get('password')?.addValidators([Validators.required, Validators.minLength(5)]);
        }
      
  }