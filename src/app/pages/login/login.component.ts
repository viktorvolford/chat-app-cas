import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCredential } from '@angular/fire/auth';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
        private userService: UserService,
        private snackBar: MatSnackBar
        ) { }
        
    ngOnInit(): void {     
        this.addValidators();
    }
    
    login(loginType: string){
        this.loading = true;
        this.getCredentialsForType(loginType)
            .then(cred  => {
                const credentials = cred as UserCredential;
                this.userService.getById(credentials.user.uid).subscribe(data => {
                    if(!data){
                        const user : User = {
                            id: cred.user?.uid as string,
                            email: credentials.user.email as string,
                            username: credentials.user.displayName as string,
                            name: {
                              firstname: credentials.user.displayName?.split(' ')[0] as string,
                              lastname: credentials.user.displayName?.split(' ')[1] as string
                            },
                            last_active: new Date().getTime()
                        };
                        this.userService.create(user).then(_ => {
                        this.snackBar.open('User has been created successfully!', 'Great', {duration: 2000});
                        this.router.navigateByUrl('/main');
                        }).catch(error => {
                        console.log(error);
                        });  
                    }
                });
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
            return this.authService.loginWithGoogle();
        } else {
            return this.authService.login(this.loginForm.get('email')?.value as string, this.loginForm.get('password')?.value as string);
        }
    }
    
    addValidators() {
        this.loginForm.get('email')?.addValidators([Validators.required, Validators.email]);
        this.loginForm.get('password')?.addValidators([Validators.required, Validators.minLength(5)]);
    }
      
  }