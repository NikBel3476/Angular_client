import { Md5 } from "ts-md5/dist/md5";
import { Socket } from 'ngx-socket-io';

import { SETTINGS } from "./Settings";
import { User } from '../user';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Server {

  HOST = SETTINGS.HOST;
  PORT = SETTINGS.PORT;
  MESSAGES = SETTINGS.MESSAGES;

  constructor(private socket: Socket) {

    Object.keys(this.EVENTS).forEach(key => this.events[this.EVENTS[key]] = []);

    this.socket.on(this.EVENTS.LOGIN, (data: any) =>
      this.fireEvent(this.EVENTS.LOGIN, data));
    this.socket.on(this.EVENTS.REGISTRATION, (data: any) =>
      this.fireEvent(this.EVENTS.REGISTRATION, data));
    this.socket.on(this.EVENTS.LOGOUT, (data: any) =>
      this.fireEvent(this.EVENTS.LOGOUT, data));
    this.socket.on(this.EVENTS.GET_MESSAGE, (data: any) =>
      this.fireEvent(this.EVENTS.GET_MESSAGE, data));
    this.socket.on(this.EVENTS.USER_ONLINE, (data: any) =>
      this.fireEvent(this.EVENTS.USER_ONLINE, data));
    this.socket.on(this.EVENTS.USER_OFFLINE, (data: any) =>
      this.fireEvent(this.EVENTS.USER_OFFLINE, data));
  
    this.socket.on('connect', () => console.log('sockets connected'));
  }

  EVENTS: { [key: string]: string } = {
    REGISTRATION: "REGISTRATION",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    GET_MESSAGE: "GET_MESSAGE",
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE"
  };
  
  events: { [key: string]: any[] } = {};

  private fireEvent(name: string, data: any) {
    if (this.events[name]) {
      this.events[name].forEach((event: any) => {
        if (event instanceof Function) {
          event(data);
        }
      })
    }
  };

  on(name: string, func: any) {
    if (name && this.events[name] && func instanceof Function) {
      this.events[name].push(func);
    }
  }

  getEvents() {
    return this.EVENTS;
  }

  login(user: User) {
    const { login, password } = user;
    if (login && password) {
      const num = Math.round(Math.random() * 1000000);
      const passHash = Md5.hashStr(login + password);
      const token = Md5.hashStr(passHash + String(num));
      this.socket.emit(this.MESSAGES.LOGIN, { login, passHash, token, num });
    }
  }

  registration(user: User) {
    const { login, nickname, password } = user;
    if (nickname && login && password) {
      const num = Math.round(Math.random() * 1000000);
      const passHash = Md5.hashStr(login + password);
      const token = Md5.hashStr(passHash + String(num));
      this.socket.emit(this.MESSAGES.REGISTRATION, { login, nickname, passHash, token, num });
    }
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.socket.emit(this.MESSAGES.LOGOUT, token);
    }
  }

  sendMessage(message: String) {
    if (message) {
      const token = localStorage.getItem('token');
      this.socket.emit(this.MESSAGES.SEND_MESSAGE, { message, token });
    }
  }
}
