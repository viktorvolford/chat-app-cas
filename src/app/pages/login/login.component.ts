import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    hide: boolean = true;
    
    loginForm = this.formBuilder.group({
        email: [''],
        password: ['']
    });
  
    loading: boolean = false;
    
    constructor(
        private router: Router, 
        private formBuilder: FormBuilder,
        private authService: AuthService
        ) { }
        
        ngOnInit(): void {     
            this.addValidators();
        }
        
        login(){
            
            this.loading = true;
            this.authService.login(this.loginForm.get('email')?.value as string, this.loginForm.get('password')?.value as string)
                .then(cred => {
                    console.log(cred);
                    this.router.navigateByUrl('/main');
                }).catch(err => {
                    console.error(err);
                }).finally(() => {
                    this.loading = false;
                });
        }
        
        addValidators() {
            this.loginForm.get('email')?.addValidators([Validators.required, Validators.email]);
            this.loginForm.get('password')?.addValidators([Validators.required, Validators.minLength(5)]);
        }
      
  }