import { Injectable } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { setLoading } from '../actions/loading.actions';
import { loginWithEmailPassword, loginWithGoogle, loginFailed, loginSuccess } from '../actions/user-session.actions';
 
@Injectable()
export class AuthEffects {
  loginWithEmailPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithEmailPassword),
      exhaustMap(action => 
        from(this.authService.loginWithEmailPassword(action.email, action.password)).pipe(
            map(creds => loginSuccess({id: creds.user.uid})),
            catchError(_ => of(loginFailed()))
        )
      )
    )
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithGoogle),
      exhaustMap(_ =>  
        from(this.authService.loginWithGoogle()).pipe(
          map((cred: UserCredential) => {
              this.userService.createUserIfNonExisting(cred);
              return loginSuccess({id: cred.user.uid});
          }),
          catchError(_ => of(loginFailed()))
        ) 
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(_ => this.router.navigateByUrl('/main')),
      map(_ => setLoading({value: false}))
    )
  );

  loginFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginFailed),
      tap(_ => this.toast.createSnackBar('LOGIN_REGISTER.AUTH_FAILED', 'COMMON.OK', 1000)),
      map(_ => setLoading({value: false}))
    )
  );
 
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}
}