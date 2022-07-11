import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private readonly snackBar: MatSnackBar, 
    private readonly translate: TranslateService
    ) { }

  public createSnackBar(content: string, action: string, duration: number = 2000){
    this.snackBar.open(
      this.translate.instant(content),
      this.translate.instant(action),
      {duration}
    )
  }
}
