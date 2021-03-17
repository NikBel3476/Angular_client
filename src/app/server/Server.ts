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
    /* this.socket = io(`${this.HOST}:${this.PORT}`);
    if (this.socket) {
      console.log('socket connected');
    }; */

    // authorization
    /* this.socket.on(this.MESSAGES.LOGIN, (data: any) => {
      if (data) {
        localStorage.setItem('token', data);
      }
    });

    // registration
    this.socket.on(this.MESSAGES.REGISTRATION, (data: any) => {
      if (data) {
        localStorage.setItem('token', data);
      }
    }); */

    Object.keys(this.EVENTS).forEach(key => this.events[this.EVENTS[key]] = []);

    this.socket.on(this.EVENTS.LOGIN, (data: any) =>
      this.fireEvent(this.EVENTS.LOGIN, data));
    this.socket.on(this.EVENTS.REGISTRATION, (data: any) =>
      this.fireEvent(this.EVENTS.REGISTRATION, data));
    this.socket.on(this.EVENTS.GET_MESSAGE, (data: any) =>
      this.fireEvent(this.EVENTS.GET_MESSAGE, data));
  }

  EVENTS: { [key: string]: string } = {
    REGISTRATION: "REGISTRATION",
    LOGIN: "LOGIN",
    GET_MESSAGE: "GET_MESSAGE"
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

  sendMessage(message: String) {
    if (message) {
      const token = localStorage.getItem('token');
      this.socket.emit(this.MESSAGES.SEND_MESSAGE, { message, token });
    }
  }
}
