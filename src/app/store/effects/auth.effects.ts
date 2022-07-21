import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { setLoading } from '../actions/loading.actions';
import { loginWithEmailPassword, loginWithGoogle, loginFailed, loginSuccess, logout } from '../actions/user-session.actions';
 
@Injectable()
export class AuthEffects {
  loginWithEmailPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithEmailPassword),
      exhaustMap(action => 
        from(this.authService.loginWithEmailPassword(action.email, action.password)).pipe(
            catchError(() => of(loginFailed()))
        )
      )
    ),
    {dispatch: false}
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithGoogle),
      exhaustMap(() =>  
        from(this.authService.loginWithGoogle()).pipe(
          tap(cred => this.userService.createUserIfNonExisting(cred)),
          catchError(() => of(loginFailed()))
        ) 
      )
    ),
    {dispatch: false}
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(() => this.router.navigateByUrl('/main')),
      map(() => setLoading({value: false}))
    )
  );

  loginFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginFailed),
      tap(() => this.toast.createSnackBar('LOGIN_REGISTER.AUTH_FAILED', 'COMMON.OK', 1000)),
      map(() => setLoading({value: false}))
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() => from(this.authService.logout()).pipe(
        tap(() => this.router.navigateByUrl('/login'))
      )),
    ),
    {dispatch: false}
  )
 
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}
}