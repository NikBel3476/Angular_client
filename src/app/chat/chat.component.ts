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
    serverService.on(this.EVENTS.GET_MESSAGE, (data: any) => this.getMessage(data));
    serverService.on(this.EVENTS.USER_ONLINE, (data: any) => this.whenUserEntered(data));
    serverService.on(this.EVENTS.USER_OFFLINE, (data: any) => this.whenUserLeaved(data));
  }

  ngOnInit(): void {
  }

  message = "";
  chat = "";

  sendMessage() {
    this.serverService.sendMessage(this.message);
  }

  getMessage(data: any) {
    if (data.message && data.name) {
        this.chat += data.name + ': ' + data.message + '\n';
    };
  }

  whenUserEntered(data: any) {
    if (data.name && data.id) {
      this.chat += "Пользователь: " + data.name + '\n' + "Вошёл в чат! \n";
    };
  }

  whenUserLeaved(data: any) {
    if (data.name && data.id) {
      this.chat += "Пользователь: " + data.name + '\n' + "Покинул в чат! \n";
    };
  }
  
}
