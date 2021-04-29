import { Md5 } from "ts-md5/dist/md5";
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private socket: Socket,
    private cookieService: CookieService
    ) {

    Object.keys(this.EVENTS).forEach(key => this.events[this.EVENTS[key]] = []);

    this.socket.on(this.EVENTS.LOGIN, (data: any) =>
      this.fireEvent(this.EVENTS.LOGIN, data));
    this.socket.on(this.EVENTS.REGISTRATION, (data: any) =>
      this.fireEvent(this.EVENTS.REGISTRATION, data));
    this.socket.on(this.EVENTS.LOGOUT, (data: any) =>
      this.fireEvent(this.EVENTS.LOGOUT, data));
    this.socket.on(this.EVENTS.GET_MESSAGE, (data: any) =>
      this.fireEvent(this.EVENTS.GET_MESSAGE, data));
    /* this.socket.on(this.EVENTS.USER_ONLINE, (data: any) =>
      this.fireEvent(this.EVENTS.USER_ONLINE, data));
    this.socket.on(this.EVENTS.USER_OFFLINE, (data: any) =>
      this.fireEvent(this.EVENTS.USER_OFFLINE, data)); */
    this.socket.on(this.EVENTS.CREATE_ROOM, (data: any) =>
      this.fireEvent(this.EVENTS.CREATE_ROOM, data));
    this.socket.on(this.EVENTS.JOIN_ROOM, (data: any) =>
      this.fireEvent(this.EVENTS.JOIN_ROOM, data));
    this.socket.on(this.EVENTS.LEAVE_ROOM, (data: any) =>
      this.fireEvent(this.EVENTS.LEAVE_ROOM, data));
    this.socket.on(this.EVENTS.GET_ROOMS, (data: any) =>
      this.fireEvent(this.EVENTS.GET_ROOMS, data));
    this.socket.on(this.EVENTS.USER_ENTER_CHAT, (data: any) =>
      this.fireEvent(this.EVENTS.USER_ENTER_CHAT, data));
    this.socket.on(this.EVENTS.USER_LEAVE_CHAT, (data: any) =>
      this.fireEvent(this.EVENTS.USER_LEAVE_CHAT, data));
  
    this.socket.on('connect', () => console.log('sockets connected'));
  }

  EVENTS: { [key: string]: string } = {
    REGISTRATION: "REGISTRATION",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    GET_MESSAGE: "GET_MESSAGE",
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    GET_ROOMS: "GET_ROOMS",
    USER_ENTER_CHAT: 'USER_ENTER_CHAT',
    USER_LEAVE_CHAT: 'USER_LEAVE_CHAT',
  };
  
  events: { [key: string]: any[] } = {};

  private fireEvent(name: string, data: any) {
    if (this.events[name]) {
      this.events[name].forEach((event: any) => {
        if (event instanceof Function) {
          event(data);
        }
      });
    }
  }

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
      const hash = Md5.hashStr(passHash + String(num));
      this.socket.emit(this.MESSAGES.LOGIN, { login, hash, num });
    }
  }

  registration(user: User) {
    const { login, nickname, password } = user;
    if (nickname && login && password) {
      const passHash = Md5.hashStr(login + password);
      this.socket.emit(this.MESSAGES.REGISTRATION, { login, nickname, passHash });
    }
  }

  logout() {
    const token = this.cookieService.get('token');
    if (token) {
      this.socket.emit(this.MESSAGES.LOGOUT, token);
    }
  }

  sendMessage(message: String) {
    if (message) {
      const token = this.cookieService.get('token');
      this.socket.emit(this.MESSAGES.SEND_MESSAGE, { message, token });
    }
  }

  createRoom(roomName: string) {
    const data = {
      roomName,
      token: this.cookieService.get('token')
    }
    this.socket.emit(this.MESSAGES.CREATE_ROOM, data);
  }

  leaveRoom(roomName: string) {
    const data = {
      roomName,
      token: this.cookieService.get('token')
    }
    this.socket.emit(this.MESSAGES.LEAVE_ROOM, data);
  }

  joinRoom(roomName: string) {
    const data = {
      roomName,
      token: this.cookieService.get('token')
    };
    this.socket.emit(this.MESSAGES.JOIN_ROOM, data);
  }

  getRooms() {
    this.socket.emit(this.MESSAGES.GET_ROOMS);
  }

}
