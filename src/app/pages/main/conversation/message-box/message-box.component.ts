import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { Message } from '../../../../shared/models/Message';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBoxComponent implements OnInit {

  @Input() message? : Message;
  @Input() loggedInUser : string = '';
  @Input() users : User[] = [];

  @Output() deleteMessage: EventEmitter<Message> = new EventEmitter();
  @Output() editMessage: EventEmitter<Message> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  onDelete(message: Message | undefined){
    this.deleteMessage.emit(message);
  }

  onOpenEditDialog(message: Message | undefined){
    this.editMessage.emit(message);
  }

}
