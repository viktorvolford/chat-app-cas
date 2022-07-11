import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private readonly snackBar: MatSnackBar, 
    ) { }

  public createSnackBar(content: string, action: string, duration: number = 2000){
    this.snackBar.openFromComponent(
      SnackbarComponent,
      {
        data: {content: content, action: action},
        duration: duration,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      }
    );
  }
}
