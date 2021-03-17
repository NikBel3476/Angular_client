import { Component, Injectable, OnInit } from '@angular/core';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ChatComponent implements OnInit {

  EVENTS = this.serverService.getEvents();

  constructor(private serverService: ServerService) {
    serverService.on(this.EVENTS.GET_MESSAGE, (data: any) => this.getMessage(data))
  }

  ngOnInit(): void {
  }

  message = "";
  chat = "";

  sendMessage() {
    console.log(this.message);
    this.serverService.sendMessage(this.message);
  }

  getMessage(data: any) {
    console.log('olololololololo');
    if (data.message && data.messageTime && data.login) {
        this.chat += data.messageTime + '\n' + data.login + ': ' + data.message + '\n';
    };
  }
  
}
