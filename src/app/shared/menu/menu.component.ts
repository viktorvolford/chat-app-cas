import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() onCloseSidenav : EventEmitter<boolean> = new EventEmitter();
  @Output() onLogout : EventEmitter<boolean> = new EventEmitter();
  @Input() loggedInUser?: string;

  constructor() { }

  ngOnInit(): void {
  }

  close(logout?: boolean){
    if(logout === true){
      this.onLogout.emit(logout);
    }
    this.onCloseSidenav.emit(true);
  }
}
